import { NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from '@/lib/supabaseServer';
import crypto from 'crypto';

function generatePin() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

export async function POST(request: Request) {
    try {
        const { identifier, password } = await request.json();

        if (!identifier || !password) {
            return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 400 });
        }

        const supabaseAdmin = createSupabaseServiceRoleClient();
        const supabase = createSupabaseServerClient();
        let loginEmail = identifier;

        // Se não for email, tratar como username
        if (!identifier.includes('@')) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('email')
                .ilike('username', identifier)
                .maybeSingle();

            if (!profile || !profile.email) {
                // Erro genérico para não vazar info
                return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 });
            }
            loginEmail = profile.email;
        }

        // 1. Validar no Auth (Supabase vai setar os cookies na response automaticamente via SSR client)
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password,
        });

        if (signInError || !authData.user) {
            return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 });
        }

        const userId = authData.user.id;

        // 2. Criar e enviar o PIN do MFA
        const pin = generatePin();
        // Podemos gerar o hash Bcrypt manualmente aqui ou via PostgreSQL, mas o pgcrypto tem função auth.crypt no banco,
        // então é mais fácil inserir pela aplicação e deixar que a verify compare, MAS vamos gerar hash bcrypt no node se preferir.
        // Usando bcrypt Node (necessita pacote) ou envia plain pro banco hashear.
        // Pra evitar npm install bcrypt, usamos crypto padrão do Node com sha256. 
        // MAS o DB usa crypt(p_pin) que é Blowfish (bcrypt).
        // Vou enviar o hash para o DB criando uma RPC helper ou simplesmente hasheando.

        // Melhor approach: Chamar uma RPC de geração ou hashear no DB durante o insert com gen_salt('bf')
        const { error: challengeError } = await supabaseAdmin.rpc('create_mfa_challenge', {
            p_user_id: userId,
            p_pin: pin,
            p_ip: request.headers.get('x-forwarded-for') || 'unknown',
            p_user_agent: request.headers.get('user-agent') || 'unknown'
        });

        if (challengeError) {
            console.error('MFA challenge create error:', challengeError);
            return NextResponse.json({ error: challengeError.message || 'Erro ao gerar MFA' }, { status: 500 });
        }

        // SIMULAÇÃO DE E-MAIL OTP
        console.log(`\n\n=========================================\n[MFA] PIN GERADO PARA ${loginEmail}: ${pin}\n=========================================\n\n`);

        // Removemos qualquer cookie de MFA anterior
        const response = NextResponse.json({ success: true, redirectTo: '/mfa' });
        response.cookies.delete('mfa_verified');

        return response;

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: error.message || 'Ocorreu um erro no servidor' }, { status: 500 });
    }
}
