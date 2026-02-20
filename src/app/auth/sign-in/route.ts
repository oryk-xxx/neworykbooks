import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteHandlerClient } from "../../../lib/supabaseServer";

const bodySchema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");

  const parse = bodySchema.safeParse({ email });
  if (!parse.success) {
    return NextResponse.redirect(new URL("/login?error=invalid_email", request.url));
  }

  const supabase = createSupabaseRouteHandlerClient();

  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  });

  return NextResponse.redirect(
    new URL("/login?status=magic_link_sent", request.url)
  );
}

