import { env } from "../../lib/env";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { QRCodeSVG } from "qrcode.react";
import { Copy } from "lucide-react";

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
    <div className="mx-auto max-w-lg px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-medium tracking-oryk-wide text-white uppercase mb-3">
          Checkout
        </h1>
        <p className="text-sm text-text-secondary tracking-oryk uppercase">
          Finalize sua aquisição
        </p>
      </div>

      {!user ? (
        <div className="oryk-surface p-10 text-center">
          <p className="mb-6 text-text-secondary">
            Faça login para iniciar o pagamento. Usamos link mágico por e-mail.
          </p>
          <a
            href="/login?redirectTo=/checkout"
            className="oryk-button-primary w-full py-4 text-xs uppercase tracking-oryk"
          >
            Ir para login
          </a>
        </div>
      ) : null}

      {user && hasAccess ? (
        <div className="oryk-surface p-10 text-center border-accent/20">
          <div className="flex justify-center mb-4">
            <div className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(43,255,136,0.5)]" />
          </div>
          <h2 className="text-xl font-medium mb-2">Acesso Liberado</h2>
          <p className="text-sm text-text-secondary mb-8">
            Você já possui acesso vitalício à ØRYK Books.
          </p>
          <a
            href="/reader"
            className="oryk-button-accent w-full py-4 text-xs uppercase tracking-oryk"
          >
            Acessar Biblioteca
          </a>
        </div>
      ) : null}

      {user && !hasAccess && !payment ? (
        <div className="oryk-surface p-10 text-center">
          <h2 className="text-xl font-medium mb-6">Acesso Vitalício</h2>
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-4xl font-medium text-white tracking-tight">R$ 7</span>
            <span className="text-text-secondary text-sm">/ unico</span>
          </div>
          <form action={createPixPayment}>
            <button
              type="submit"
              className="w-full oryk-button-accent py-4 text-sm uppercase tracking-oryk"
            >
              Gerar PIX
            </button>
          </form>
          <p className="mt-6 text-[10px] text-text-meta uppercase tracking-oryk leading-relaxed">
            Acesso imediato após confirmação
          </p>
        </div>
      ) : null}

      {user && !hasAccess && payment ? (
        <div className="space-y-6">
          <div className="oryk-surface p-8">
            <div className="flex flex-col items-center">
              <div className="mb-8 rounded-2xl bg-white p-3 shadow-oryk ring-1 ring-white/10">
                <QRCodeSVG value={payment.qr_code} size={200} />
              </div>

              <div className="w-full space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-oryk text-text-meta px-1">
                    Código PIX Copia e Cola
                  </label>
                  <div className="group relative">
                    <input
                      readOnly
                      value={payment.qr_code}
                      className="oryk-input pr-12 text-xs font-mono truncate border-white/[0.05]"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(payment.qr_code);
                        alert("Código copiado!");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-text-secondary hover:text-white transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={payment.ticket_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full oryk-button-primary py-4 text-xs uppercase tracking-oryk"
                  >
                    Pagar no Mercado Pago
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="oryk-surface p-6 text-center border-accent/10">
            <div className="flex justify-center mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            </div>
            <p className="text-xs text-text-secondary tracking-oryk uppercase mb-1">
              Aguardando Pagamento
            </p>
            <p className="text-[10px] text-text-meta leading-relaxed">
              Confirmação automática a cada 10 segundos.
            </p>
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
      <div className="mt-8 oryk-surface p-6 border-accent/30 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <p className="text-sm font-medium text-accent mb-4">Pagamento aprovado!</p>
        <a
          href="/reader"
          className="oryk-button-accent w-full py-3 text-xs uppercase tracking-oryk"
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
