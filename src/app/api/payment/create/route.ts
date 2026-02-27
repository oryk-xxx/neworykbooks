import { NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!env.mercadoPagoAccessToken) {
    return NextResponse.json(
      { error: "Mercado Pago access token não configurado" },
      { status: 500 }
    );
  }

  const payload = {
    transaction_amount: 7,
    description: "Acesso vitalício ØRYK Books",
    payment_method_id: "pix",
    payer: {
      email: user.email || "user@example.com",
      first_name: user.user_metadata?.name || "Usuário"
    },
    ...(env.siteUrl && !env.siteUrl.includes("localhost") ? { notification_url: `${env.siteUrl}/api/payment/webhook` } : {})
  };

  const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.mercadoPagoAccessToken}`
    },
    body: JSON.stringify(payload)
  });

  if (!mpRes.ok) {
    const errText = await mpRes.text();
    console.error("MERCADO PAGO API ERROR:", errText);
    return NextResponse.json(
      { error: "Falha Mercado Pago", details: errText },
      { status: 500 }
    );
  }

  const json = await mpRes.json();

  await supabase
    .from("entitlements")
    .upsert({
      user_id: user.id,
      active: false,
      last_payment_id: String(json.id)
    })
    .select("*")
    .maybeSingle();

  const qr = json?.point_of_interaction?.transaction_data?.qr_code;
  const qrBase64 =
    json?.point_of_interaction?.transaction_data?.qr_code_base64;

  return NextResponse.json({
    id: String(json.id),
    status: json.status,
    qr_code: qr,
    qr_code_base64: qrBase64
  });
}

