import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { pin } = await request.json();

        const cookieStore = cookies();
        const pendingEmail = cookieStore.get('mfa_pending_email')?.value;

        if (!pin || pin.length !== 8) {
            return NextResponse.json({ error: 'PIN inválido (deve ter 8 dígitos)' }, { status: 400 });
        }

        if (!pendingEmail) {
            return NextResponse.json({ error: 'Sessão de verificação expirada. Faça login novamente.' }, { status: 401 });
        }

        const supabase = createSupabaseServerClient();

        const { data, error } = await supabase.auth.verifyOtp({
            email: pendingEmail,
            token: pin,
            type: 'email'
        });

        if (error || !data.user || !data.session) {
            return NextResponse.json({ error: error?.message || 'PIN incorreto ou expirado' }, { status: 401 });
        }

        // OTP Verificado! O Supabase SSR client já configurou os cookies de sessão corretamente.
        const response = NextResponse.json({ success: true, redirectTo: '/reader' });
        response.cookies.delete('mfa_pending_email');

        return response;
    } catch (error: any) {
        console.error('MFA verify error:', error);
        return NextResponse.json({ error: error.message || 'Ocorreu um erro no servidor' }, { status: 500 });
    }
}
