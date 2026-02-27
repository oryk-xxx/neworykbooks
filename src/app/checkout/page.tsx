import { createSupabaseServerClient } from "@/lib/supabaseServer";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { env } from "@/lib/env";

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
    <div className="mx-auto max-w-lg px-6 py-20 min-h-[90vh] flex flex-col justify-center">
      <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <h1 className="text-header text-white mb-6">
          Portal.Finances
        </h1>
        <div className="flex items-center justify-center gap-6">
          <div className="h-[1px] w-12 bg-white/[0.06]" />
          <p className="font-mono text-[9px] text-text-secondary tracking-oryk-wide uppercase opacity-60">
            Transaction.Finalize_Protocol
          </p>
          <div className="h-[1px] w-12 bg-white/[0.06]" />
        </div>
      </div>

      <CheckoutClient
        user={user}
        hasAccess={hasAccess}
        price={env.paymentAmount}
        originalPrice={env.originalAmount}
      />

      <div className="mt-24 text-center opacity-30 animate-in fade-in duration-1000 delay-500">
        <p className="font-mono text-[9px] tracking-oryk-wide uppercase text-text-meta">
          ØRYK // ACCESS_GATEWAY_V.2026
        </p>
      </div>
    </div>
  );
}
