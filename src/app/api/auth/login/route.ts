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

        // 2. Verificar se o MFA está habilitado por variável de ambiente
        const isMfaEnabled = process.env.NEXT_PUBLIC_REQUIRE_MFA !== 'false'; // Padrão é habilitado

        if (!isMfaEnabled) {
            // Se MFA desabilitado, o login via senha conclui a autenticação
            return NextResponse.json({ success: true, redirectTo: '/reader' });
        }

        // 3. MFA Habilitado. Para não deixar o usuário fully logged in, vamos deslogar (remover os cookies de sessão)
        // e usar o signInWithOtp para enviar o código pro email. Assim a sessão só é obtida no /mfa.
        await supabase.auth.signOut();

        const { error: challengeError } = await supabase.auth.signInWithOtp({
            email: loginEmail,
            options: {
                shouldCreateUser: false
            }
        });

        if (challengeError) {
            console.error('MFA challenge create error:', challengeError);
            return NextResponse.json({ error: challengeError.message || 'Erro ao gerar MFA' }, { status: 500 });
        }

        // Retorna sucesso e manda para /mfa. Salvamos qual email enviamos num cookie temporário para o verify.
        const response = NextResponse.json({ success: true, redirectTo: '/mfa' });
        response.cookies.set('mfa_pending_email', loginEmail, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

        return response;

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: error.message || 'Ocorreu um erro no servidor' }, { status: 500 });
    }
}
