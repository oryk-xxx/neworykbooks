import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-24 min-h-[calc(100vh-5rem)] flex flex-col justify-center">
      <div className="flex flex-col gap-24 lg:flex-row lg:items-center">
        <section className="flex-1 space-y-12">
          <div className="space-y-4">
            <h2 className="text-header">ØRYK.Infrastructure.Module.01</h2>
            <h1 className="font-sans text-5xl font-medium tracking-tight md:text-7xl text-white leading-[1.1]">
              Escreva como quem <br />
              <span className="text-primary opacity-90">
                domina o sistema
              </span>
              .
            </h1>
          </div>

          <p className="max-w-xl text-body opacity-80 decoration-primary/20">
            ØRYK Books é uma interface de processamento para livros digitais sobre
            escrita, mensagem, postura e comunicação. Um único protocolo de acesso,
            licença vitalícia, foco absoluto em transmissão de conhecimento.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] text-text-secondary bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded">
              <span className="status-dot" />
              <span>ACCESS.UNIT: R$7</span>
            </div>
            <div className="font-mono text-[9px] tracking-[0.15em] text-text-tertiary border border-white/[0.06] px-3 py-1.5 rounded uppercase">
              Leitura.Por.Blocos
            </div>
            <div className="font-mono text-[9px] tracking-[0.15em] text-text-tertiary border border-white/[0.06] px-3 py-1.5 rounded uppercase">
              IA.Validation.Active
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6 sm:flex-row">
            <Link
              href="/checkout"
              className="oryk-button-accent px-8 py-4 text-[10px] items-center gap-2 group"
            >
              <span>INICIAR TRANSMISSÃO</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/login"
              className="oryk-button border border-white/[0.08] bg-white/[0.03] px-8 py-4 text-[10px] text-text-secondary hover:bg-white/[0.06] hover:text-white"
            >
              AUTENTICAR TERMINAL
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10 border-t border-white/[0.06]">
            <div className="space-y-2">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white font-semibold">Leitura Progressiva</p>
              <p className="font-mono text-[11px] text-text-tertiary leading-relaxed">O sistema impede o avanço até que o processamento da página seja validado.</p>
            </div>
            <div className="space-y-2">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white font-semibold">Correção Algorítmica</p>
              <p className="font-mono text-[11px] text-text-tertiary leading-relaxed">Mapeamento dinâmico Errado → Certo refinando sua comunicação em tempo real.</p>
            </div>
          </div>
        </section>

        <section className="flex-1 lg:pl-12">
          <div className="oryk-surface p-1 shadow-2xl relative">
            <div className="bg-black/40 p-10 rounded-lg space-y-8 overflow-hidden">
              <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-text-tertiary border-b border-white/[0.06] pb-4">
                <span>INTERFACE.PREVIEW</span>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>IMMERSIVE.MODE</span>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-label text-primary/60 tracking-[0.2em]">Protocolo Delta · Errado → Certo</p>

                <div className="grid gap-4 md:grid-cols-1">
                  <div className="oryk-surface bg-red-500/[0.02] border-red-500/10 p-6 space-y-3">
                    <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-red-500/80">Entrada.Restrita</p>
                    <p className="font-mono text-sm text-red-100/60 leading-relaxed italic">"mb, vê isso aí pra mim rapidão"</p>
                    <p className="font-mono text-[8px] text-red-500/40 uppercase tracking-widest">Postura detectada: Baixa Autoridade</p>
                  </div>

                  <div className="flex justify-center py-2">
                    <div className="h-8 w-px bg-gradient-to-b from-red-500/20 to-primary/20" />
                  </div>

                  <div className="oryk-surface bg-primary/[0.02] border-primary/20 p-6 space-y-3 shadow-[glow]">
                    <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-primary">Saída.Otimizada</p>
                    <p className="font-mono text-sm text-primary/80 leading-relaxed">"Meu bem, consegue revisar isso com calma? Te explico o contexto."</p>
                    <p className="font-mono text-[8px] text-primary/40 uppercase tracking-widest">Status: Comunicação Refinada</p>
                  </div>
                </div>
              </div>

              <p className="font-mono text-[10px] text-text-tertiary leading-normal border-t border-white/[0.06] pt-6 italic opacity-50">
                A ØRYK intercepta padrões de linguagem comuns e os reescreve em alta definição.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

