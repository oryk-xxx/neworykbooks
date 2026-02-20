export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-borderSubtle/80 bg-black/60 p-6">
        <h1 className="mb-2 text-lg font-semibold tracking-tight">
          Entrar na ØRYK Books
        </h1>
        <p className="mb-6 text-xs text-zinc-400">
          Use seu e-mail para criar ou acessar sua conta. O pagamento é feito
          depois, via PIX.
        </p>
        <form action="/auth/sign-in" method="post" className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs text-zinc-300" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="h-9 w-full rounded-md border border-borderSubtle/80 bg-black/60 px-3 text-sm outline-none ring-0 focus:border-accent"
              placeholder="voce@exemplo.com"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-9 w-full items-center justify-center rounded-md bg-accent text-sm font-medium text-black transition hover:bg-accent/90"
          >
            Receber link mágico
          </button>
        </form>
      </div>
    </div>
  );
}
