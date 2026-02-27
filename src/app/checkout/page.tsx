import { env } from "../../lib/env";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
export const dynamic = "force-dynamic";

async function createPixPayment(user: any) {
  if (!env.mercadoPagoAccessToken) {
    throw new Error("Mercado Pago access token não configurado");
  }

  const payload = {
    transaction_amount: 7,
    description: "Acesso vitalício ØRYK Books",
    payment_method_id: "pix",
    payer: {
      email: user.email || "user@example.com",
      first_name: user.user_metadata?.name || "Usuário"
    },
    notification_url: `${env.siteUrl}/api/payment/webhook`
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
    throw new Error(`Falha Mercado Pago: ${errText}`);
  }

  const json = await mpRes.json();
  const supabase = createSupabaseServerClient();

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
  const qrBase64 = json?.point_of_interaction?.transaction_data?.qr_code_base64;
  const ticketUrl = json?.point_of_interaction?.transaction_data?.ticket_url;

  return {
    id: String(json.id),
    status: json.status,
    qr_code: qr,
    qr_code_base64: qrBase64,
    ticket_url: ticketUrl
  };
}

export default async function CheckoutPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const entitlement = user
    ? (
      await supabase
        .from("entitlements")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()
    ).data
    : null;

  const hasAccess = entitlement?.active === true;

  const payment = user && !hasAccess ? await createPixPayment(user) : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-xl font-semibold tracking-tight">Pagamento PIX</h1>
      <p className="text-xs text-zinc-400">
        Acesso único e vitalício à ØRYK Books. Valor: R$7.
      </p>

      {!user ? (
        <div className="mt-6 rounded-2xl border border-borderSubtle/80 bg-black/60 p-4 text-sm">
          <p className="mb-2">
            Faça login para iniciar o pagamento. Usamos link mágico por e-mail.
          </p>
          <a
            href="/login?redirectTo=/checkout"
            className="inline-flex rounded-full border border-accent/60 bg-accent/10 px-4 py-2 text-xs text-accent"
          >
            Ir para login
          </a>
        </div>
      ) : null}

      {user && hasAccess ? (
        <div className="mt-6 rounded-2xl border border-emerald-700/60 bg-emerald-950/40 p-4 text-sm text-emerald-50">
          <p className="mb-2">Acesso já está liberado para sua conta.</p>
          <a
            href="/reader"
            className="inline-flex rounded-full bg-emerald-500 px-4 py-2 text-xs font-medium text-black"
          >
            Ir para a biblioteca
          </a>
        </div>
      ) : null}

      {user && !hasAccess && payment ? (
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-borderSubtle/80 bg-black/60 p-4">
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              QR Code PIX
            </p>
            <img
              src={`data:image/png;base64,${payment.qr_code_base64}`}
              alt="QR Code PIX"
              className="mx-auto w-64 rounded-lg border border-borderSubtle/80"
            />
          </div>
          <div className="rounded-2xl border border-borderSubtle/80 bg-black/60 p-4 text-xs">
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Copia e cola
            </p>
            <p className="break-all rounded-lg border border-borderSubtle/80 bg-black/40 p-3 text-zinc-200">
              {payment.qr_code}
            </p>
            <p className="mt-3 text-zinc-400">
              Após aprovado, seu acesso será liberado automaticamente. Esta página
              atualiza a cada 10 segundos.
            </p>
            {payment.ticket_url && (
              <div className="mt-4">
                <a
                  href={payment.ticket_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full justify-center rounded-full border border-accent/60 bg-accent/10 px-4 py-2 text-xs font-medium text-accent hover:bg-accent/20"
                >
                  Abrir no Mercado Pago (Link)
                </a>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {user && !hasAccess && payment ? (
        <RefreshStatus paymentId={payment.id} />
      ) : null}
    </div>
  );
}

async function RefreshStatus({ paymentId }: { paymentId: string }) {
  const res = await fetch(`${env.siteUrl}/api/payment/status?id=${paymentId}`, {
    cache: "no-store",
    next: { revalidate: 0 }
  });
  const data = res.ok ? await res.json() : null;
  const approved = data?.status === "approved";

  if (approved) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-700/60 bg-emerald-950/40 p-4 text-sm text-emerald-50">
        <p className="mb-2">Pagamento aprovado! Seu acesso está liberado.</p>
        <a
          href="/reader"
          className="inline-flex rounded-full bg-emerald-500 px-4 py-2 text-xs font-medium text-black"
        >
          Ir para a biblioteca
        </a>
      </div>
    );
  }

  return (
    <meta httpEquiv="refresh" content="10" />
  );
}
