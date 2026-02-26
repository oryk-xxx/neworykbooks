import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
    try {
        const { password, confirmPassword } = await request.json();

        if (!password || password !== confirmPassword) {
            return NextResponse.json({ error: 'As senhas não coincidem ou são inválidas' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'A senha deve ter pelo menos 8 caracteres' }, { status: 400 });
        }

        const supabase = createSupabaseServerClient();

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'Senha atualizada com sucesso' });
    } catch (error: any) {
        console.error('Reset error:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
