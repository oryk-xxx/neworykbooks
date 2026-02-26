import { NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
    try {
        const { email, username, password, confirmPassword } = await request.json();

        if (!email || !username || !password || !confirmPassword) {
            return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'As senhas não coincidem' }, { status: 400 });
        }

        // Regras do prompt
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return NextResponse.json({ error: 'Username deve ter 3-20 caracteres (letras, números ou _)' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ error: 'A senha deve ter pelo menos 8 caracteres' }, { status: 400 });
        }

        const supabaseAdmin = createSupabaseServiceRoleClient();
        const supabase = createSupabaseServerClient();

        // 1. Verificar se username já existe
        const { data: existingUser } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .ilike('username', username)
            .maybeSingle();

        if (existingUser) {
            return NextResponse.json({ error: 'Username já está em uso' }, { status: 400 });
        }

        // 2. Sign up no Auth
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username.toLowerCase(),
                }
            }
        });

        if (signUpError) {
            return NextResponse.json({ error: signUpError.message }, { status: 400 });
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
        }

        // 3. Salvar o username real no profile (fazemos upsert no service role para evitar RLS issues de novo user não estar logado ainda em certas configs)
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: authData.user.id,
                email: email,
                username: username.toLowerCase()
            });

        if (profileError) {
            console.error("Profile error", profileError);
            // Revert auth user creation if profile fails to keep DB consistent
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            return NextResponse.json({ error: `Falha ao criar perfil: ${profileError.message}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Conta criada com sucesso!' });
    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json({ error: error.message || 'Ocorreu um erro no servidor' }, { status: 500 });
    }
}
