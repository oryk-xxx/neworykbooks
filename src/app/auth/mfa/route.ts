import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
    try {
        const { pin } = await request.json();

        if (!pin || pin.length !== 6) {
            return NextResponse.json({ error: 'PIN inválido' }, { status: 400 });
        }

        // Como o usuário já tem os tokens de Auth (porém está travado pelo middleware),
        // o client do server já está amarrado ao `user`.
        const supabase = createSupabaseServerClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
        }

        // Chama a RPC via Client padrão (que vai usar o contexto do auth.uid() devido ao Security Definer e RLS)
        const { data: isValid, error: rpcError } = await supabase.rpc('verify_mfa_pin', {
            p_pin: pin
        });

        if (rpcError) {
            console.error('MFA Verify RPC Error:', rpcError);
            return NextResponse.json({ error: 'Erro na validação do PIN' }, { status: 500 });
        }

        if (isValid === true) {
            const response = NextResponse.json({ success: true });
            // Seta o cookie com validade (ex: 12h)
            response.cookies.set('mfa_verified', '1', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 12, // 12 hours
                path: '/',
            });
            return response;
        } else {
            return NextResponse.json({ error: 'PIN incorreto ou expirado' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('MFA error:', error);
        return NextResponse.json({ error: 'Ocorreu um erro no servidor' }, { status: 500 });
    }
}
