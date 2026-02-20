import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ØRYK Books",
  description: "Plataforma premium de leitura com foco em escrita refinada"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(123,92,255,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(0,0,0,0.9),_transparent_55%)]" />
        <div className="relative min-h-screen flex flex-col">
          <header className="border-b border-borderSubtle/60 bg-black/40 backdrop-blur-xl">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold tracking-[0.25em] uppercase">
                  ØRYK
                </span>
                <span className="text-sm text-zinc-400">Books</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>Acesso vitalício</span>
                <span className="h-4 w-px bg-zinc-700" />
                <span>R$7</span>
              </div>
            </div>
          </header>
          <main className="flex-1">{props.children}</main>
        </div>
      </body>
    </html>
  );
}

