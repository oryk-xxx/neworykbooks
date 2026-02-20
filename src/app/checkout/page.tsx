import { env } from "../../lib/env";
import { createSupabaseServerComponentClient } from "../../lib/supabaseServer";

async function createPixPayment() {
  const res = await fetch(`${env.siteUrl}/api/payment/create`, {
    method: "POST",
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error("Falha ao criar pagamento PIX");
  }
  return res.json();
}

export default async function CheckoutPage() {
  const supabase = createSupabaseServerComponentClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const entitlement = session
    ? (
        await supabase
          .from("entitlements")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle()
      ).data
    : null;

  const hasAccess = entitlement?.active === true;

  const payment = session && !hasAccess ? await createPixPayment() : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-xl font-semibold tracking-tight">Pagamento PIX</h1>
      <p className="text-xs text-zinc-400">
        Acesso único e vitalício à ØRYK Books. Valor: R$7.
      </p>

      {!session ? (
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

      {session && hasAccess ? (
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

      {session && !hasAccess && payment ? (
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
              atualiza a cada 5 segundos.
            </p>
          </div>
        </div>
      ) : null}

      {session && !hasAccess && payment ? (
        <RefreshStatus paymentId={payment.id} />
      ) : null}
    </div>
  );
}

async function RefreshStatus({ paymentId }: { paymentId: string }) {
  const res = await fetch(`${env.siteUrl}/api/payment/status?id=${paymentId}`, {
    cache: "no-store"
  });
  const data = res.ok ? await res.json() : null;
  const approved = data?.status === "approved";
  const isPending = data?.status === "pending";

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
    <meta httpEquiv="refresh" content="5" />
  );
}
