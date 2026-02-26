-- ==============================================================================
-- SETUP E EXTENSÕES
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABELA DE PERFIS (PROFILES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS em profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Índice para busca case-insensitive eficiente por username
CREATE UNIQUE INDEX idx_profiles_username_lower ON public.profiles (LOWER(username));

-- Usuário pode ler e atualizar apenas o próprio perfil
CREATE POLICY "Usuários podem ver o próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar o próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ==============================================================================
-- 2. TABELA DE MFA CHALLENGES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mfa_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pin_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  attempts INT DEFAULT 0,
  ip TEXT NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS em mfa_challenges
ALTER TABLE public.mfa_challenges ENABLE ROW LEVEL SECURITY;

-- Usuário só vê seus próprios desafios
CREATE POLICY "Usuários podem ver seus próprios challenges"
  ON public.mfa_challenges FOR SELECT
  USING (auth.uid() = user_id);

-- Somente o sistema (via policies ou SECURITY DEFINER) pode inserir/atualizar
-- Nenhuma policy de insert/update pública para mfa_challenges para garantir segurança.

-- ==============================================================================
-- 3. TABELA DE EVENTOS DE AUTENTICAÇÃO (LOGS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.auth_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NULL,
  email TEXT NULL,
  event_type TEXT NOT NULL,
  ip TEXT NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS em auth_events
ALTER TABLE public.auth_events ENABLE ROW LEVEL SECURITY;

-- Nenhuma policy pública. Apenas service_role ou admin pode ver/inserir.

-- ==============================================================================
-- 4. FUNÇÕES E TRIGGERS
-- ==============================================================================

-- Função para garantir username gerando erro em duplicatas (já temos index, mas garante)
CREATE OR REPLACE FUNCTION public.check_username_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
  -- Transforma em minúsculo
  NEW.username := LOWER(NEW.username);
  
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE LOWER(username) = NEW.username 
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Username already taken';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_unique_username
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_username_uniqueness();

-- ==============================================================================
-- 5. RPC SECURITY DEFINER (Validação e Criação de MFA)
-- ==============================================================================

-- Função segura para criação do challenge (faz o hash no banco)
CREATE OR REPLACE FUNCTION public.create_mfa_challenge(
  p_user_id UUID,
  p_pin TEXT,
  p_ip TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_challenge_id UUID;
BEGIN
  INSERT INTO public.mfa_challenges (user_id, pin_hash, expires_at, ip, user_agent)
  VALUES (
    p_user_id,
    public.crypt(p_pin, public.gen_salt('bf')),
    NOW() + INTERVAL '10 minutes',
    p_ip,
    p_user_agent
  )
  RETURNING id INTO v_challenge_id;
  
  -- Opcional log
  INSERT INTO public.auth_events (user_id, event_type) VALUES (p_user_id, 'mfa_sent');
  
  RETURN v_challenge_id;
END;
$$;

-- Função segura para validação do PIN
CREATE OR REPLACE FUNCTION public.verify_mfa_pin(p_pin TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_challenge RECORD;
BEGIN
  -- Pega o ID do usuário atualmente logado (sessão Supabase base)
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Busca o challenge mais recente, que ainda não expirou e não foi usado
  SELECT * INTO v_challenge
  FROM public.mfa_challenges
  WHERE user_id = v_user_id
    AND used_at IS NULL
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Verifica número de tentativas (máx 5)
  IF v_challenge.attempts >= 5 THEN
    -- Invalida o challenge por segurança devido a brute-force
    UPDATE public.mfa_challenges SET used_at = NOW() WHERE id = v_challenge.id;
    RETURN FALSE;
  END IF;

  -- Hasheia o PIN recebido para comparar com o hash no banco.
  -- Usamos o crypt(senha, hash) do pgcrypto
  IF v_challenge.pin_hash = public.crypt(p_pin, v_challenge.pin_hash) THEN
    -- Sucesso! Marca como usado
    UPDATE public.mfa_challenges SET used_at = NOW() WHERE id = v_challenge.id;
    
    -- Opcional log de sucesso (seguro deixar service ou o banco fazer)
    INSERT INTO public.auth_events (user_id, event_type) VALUES (v_user_id, 'mfa_ok');
    
    RETURN TRUE;
  ELSE
    -- Falha: incrementa as tentativas
    UPDATE public.mfa_challenges SET attempts = attempts + 1 WHERE id = v_challenge.id;
    
    -- Opcional log de falha
    INSERT INTO public.auth_events (user_id, event_type) VALUES (v_user_id, 'mfa_fail');
    
    RETURN FALSE;
  END IF;
END;
$$;
