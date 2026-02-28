import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BackgroundEffects from "@/components/common/BackgroundEffects";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "ØRYK Books",
  description: "Plataforma premium de leitura com foco em escrita refinada"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/30 selection:text-background">
        <BackgroundEffects />

        <div className="relative min-h-screen flex flex-col z-10">
          <header className="border-b border-white/[0.06] bg-black/40 backdrop-blur-[40px] sticky top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
              <div className="flex items-center gap-4">
                <Image
                  src="/oryk.svg"
                  alt="ØRYK"
                  width={24}
                  height={24}
                  className="opacity-90"
                />
                <div className="flex flex-col">
                  <span className="font-sans text-xs font-semibold tracking-[-0.02em] uppercase text-white">
                    ØRYK
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-text-meta">
                    Infraestrutura
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-text-secondary">
                  <span className="status-dot" />
                  <span>Protocolo.Ativo</span>
                </div>

                <div className="flex items-center gap-6">
                  <span className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                    <span className="text-white">V.2.0.4</span>
                    <span className="text-text-meta">Seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">{props.children}</main>
        </div>
      </body>
    </html>
  );
}

