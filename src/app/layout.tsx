import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ØRYK Books",
  description: "Plataforma premium de leitura com foco em escrita refinada"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <div className="relative min-h-screen flex flex-col">
          <header className="border-b border-borderSubtle bg-background/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="text-xl font-medium tracking-oryk-wide uppercase">
                  ØRYK
                </span>
                <span className="h-3 w-px bg-white/10" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-text-meta">
                  Books
                </span>
              </div>
              <div className="flex items-center gap-6 text-[10px] uppercase tracking-oryk text-text-secondary">
                <div className="hidden md:flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent animate-pulse" />
                  <span>Acesso vitalício</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white">R$7</span>
                  <span className="text-text-meta">/ unico</span>
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

