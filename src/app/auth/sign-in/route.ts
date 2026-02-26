// app/auth/sign-in/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    return NextResponse.redirect(new URL("/login?e=missing_email", req.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/login?e=missing_env", req.url));
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // IMPORTANTÍSSIMO: redirectTo tem que ser seu domínio real em prod
  const origin = new URL(req.url).origin;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?e=${encodeURIComponent(error.message)}`, req.url)
    );
  }

  return NextResponse.redirect(new URL("/login?ok=sent", req.url));
}
