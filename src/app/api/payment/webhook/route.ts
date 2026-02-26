import { NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { createSupabaseServiceRoleClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const topic = new URL(request.url).searchParams.get("type") || body?.type || "";
  const dataId = body?.data?.id || body?.id;

  if (!dataId) {
    return NextResponse.json({ ok: true });
  }

  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
    headers: {
      Authorization: `Bearer ${env.mercadoPagoAccessToken}`
    }
  });
  if (!mpRes.ok) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  const json = await mpRes.json();

  const status = json.status as string;
  const supabase = createSupabaseServiceRoleClient();

  const { data: entitlement } = await supabase
    .from("entitlements")
    .select("*")
    .eq("last_payment_id", String(json.id))
    .maybeSingle();

  if (entitlement) {
    const active = status === "approved";
    await supabase
      .from("entitlements")
      .update({
        active,
        updated_at: new Date().toISOString(),
        last_payment_id: String(json.id)
      })
      .eq("user_id", entitlement.user_id);
  }

  await supabase
    .from("logs")
    .insert({
      action: `payment_webhook:${topic}:${status}`,
      user_id: entitlement?.user_id || null,
      ip: "",
      user_agent: ""
    });

  return NextResponse.json({ ok: true });
}
