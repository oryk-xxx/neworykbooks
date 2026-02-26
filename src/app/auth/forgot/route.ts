import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
        }

        const supabase = createSupabaseServerClient();
        const origin = request.headers.get('origin');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/reset`, // This URL will handle the token exchange on the client/middleware.
        });

        if (error) {
            console.error('Pass reset error', error);
            // We still return success to prevent email enumeration
        }

        return NextResponse.json({ success: true, message: 'Se o e-mail existir, um link de recuperação foi enviado.' });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
