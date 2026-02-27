import React from "react";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let hasAccess = false;
  if (user) {
    const { data: entitlement } = await supabase
      .from("entitlements")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    hasAccess = entitlement?.active === true;
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-20 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-3xl font-medium tracking-[0.5em] text-white uppercase mb-4">
          Checkout
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 bg-white/10" />
          <p className="text-[10px] text-text-secondary tracking-[0.3em] uppercase font-medium">
            Finalize sua aquisição
          </p>
          <div className="h-[1px] w-8 bg-white/10" />
        </div>
      </div>

      <CheckoutClient user={user} hasAccess={hasAccess} />

      <div className="mt-20 text-center opacity-30 animate-in fade-in duration-1000 delay-500">
        <p className="text-[9px] tracking-[0.4em] uppercase text-text-meta">
          ØRYK — Cryptographic Bookshelf
        </p>
      </div>
    </div>
  );
}
