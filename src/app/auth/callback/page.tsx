"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // Isso lê o #access_token do URL e grava a sessão no storage/cookie do supabase-js
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        router.replace(`/login?e=${encodeURIComponent(error.message)}`);
        return;
      }

      if (data.session) {
        router.replace("/reader"); // ou /admin
        return;
      }

      // se não achou sessão, dá erro explícito
      router.replace("/login?e=no_session");
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-zinc-200">
      Logando...
    </div>
  );
}
