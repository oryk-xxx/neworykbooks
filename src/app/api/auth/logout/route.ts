import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
    try {
        const supabase = createSupabaseServerClient();

        // Deslogar no Auth
        await supabase.auth.signOut();

        const response = NextResponse.json({ success: true, redirectTo: '/' });

        // Limpar cookie MFA se existir
        response.cookies.delete('mfa_verified');

        return response;
    } catch (error: any) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Erro ao deslogar' }, { status: 500 });
    }
}
