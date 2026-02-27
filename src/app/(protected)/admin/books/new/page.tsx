import React from "react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function NewBookPage() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.getUser();

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-1">
        <Link
          href="/admin/books"
          className="text-[10px] uppercase tracking-oryk text-accent hover:opacity-70 transition-opacity flex items-center gap-2 mb-4"
        >
          ← Cancelar Operação
        </Link>
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-text-meta">Novo Volume</h2>
        <p className="text-xl font-medium tracking-oryk text-white uppercase">Registrar Obra</p>
      </div>

      <div className="oryk-surface p-8">
        <form action="/admin/books/new/action" method="post" className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-oryk text-text-meta font-medium ml-1">
              Título da Obra
            </label>
            <input
              name="title"
              required
              placeholder="Ex: O Labirinto do Silêncio"
              className="oryk-input"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-oryk text-text-meta font-medium ml-1">
              Resumo / Sinopse
            </label>
            <textarea
              name="summary"
              placeholder="Uma breve descrição sobre o que trata este volume..."
              className="oryk-input min-h-[120px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-oryk text-text-meta font-medium ml-1">
              Tags de Identificação
            </label>
            <input
              name="tags"
              placeholder="Ficção, Suspense, Minimalismo"
              className="oryk-input"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="oryk-button-accent w-full py-4 text-[11px] uppercase tracking-[0.2em] font-semibold"
            >
              Confirmar Registro →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
