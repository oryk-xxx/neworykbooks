import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col gap-10 px-6 py-10 md:flex-row md:items-center">
      <section className="flex-1 space-y-6">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Plataforma premium de leitura
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Escreva como{" "}
          <span className="bg-gradient-to-r from-accent to-fuchsia-400 bg-clip-text text-transparent">
            quem sabe o que está dizendo
          </span>
          .
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-300">
          ØRYK Books é uma biblioteca curada de livros digitais sobre escrita,
          mensagem, postura e comunicação. Um único pagamento, acesso vitalício,
          foco absoluto em leitura profunda.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span className="rounded-full bg-accentMuted/60 px-3 py-1">
            Acesso único: R$7
          </span>
          <span className="rounded-full border border-borderSubtle/70 px-3 py-1">
            Leituras guiadas por blocos
          </span>
          <span className="rounded-full border border-borderSubtle/70 px-3 py-1">
            IA corrige seus resumos
          </span>
        </div>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-black shadow-lg shadow-accent/40 transition hover:bg-accent/90"
          >
            Desbloquear biblioteca
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-borderSubtle/80 bg-black/40 px-6 py-3 text-sm font-medium text-zinc-200 hover:border-accent/60"
          >
            Já tenho conta
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 pt-4 text-xs text-zinc-400">
          <div className="space-y-1">
            <p className="font-medium text-zinc-200">Leitura progressiva</p>
            <p>Você só avança quando realmente entendeu a página.</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-zinc-200">Erros em público</p>
            <p>Blocos “Errado → Certo” treinam sua comunicação no detalhe.</p>
          </div>
        </div>
      </section>
      <section className="mt-10 flex-1 md:mt-0">
        <div className="relative overflow-hidden rounded-3xl border border-borderSubtle/80 bg-black/60 p-5 shadow-xl shadow-black/60">
          <div className="mb-4 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="uppercase tracking-[0.2em]">Preview de leitura</span>
            <span>Modo escuro imersivo</span>
          </div>
          <div className="space-y-4 rounded-2xl border border-borderSubtle/80 bg-gradient-to-b from-zinc-900/60 to-black/90 p-4 text-xs leading-relaxed text-zinc-200">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Bloco especial · Errado → Certo
            </p>
            <div className="grid gap-3 rounded-xl bg-zinc-900/70 p-3 text-[11px] md:grid-cols-2">
              <div className="rounded-lg border border-red-900/60 bg-red-950/40 p-3">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-red-400">
                  Errado
                </p>
                <p className="text-zinc-200">"mb, vê isso aí pra mim rapidão"</p>
                <p className="mt-2 text-[10px] text-red-300/80">
                  Categoria: postura · Nível: iniciante
                </p>
              </div>
              <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/40 p-3">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                  Certo
                </p>
                <p className="text-zinc-200">
                  "Meu bem, consegue revisar isso com calma? Te explico o contexto."
                </p>
                <p className="mt-2 text-[10px] text-emerald-300/80">
                  Clara, respeitosa e contextualizada.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400">
              Cada página da ØRYK Books transforma detalhes de linguagem em resultados:
              mais respeito, mais clareza, mais resposta.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

