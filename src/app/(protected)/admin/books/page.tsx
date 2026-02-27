import React from "react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function AdminBooksPage() {
  const supabase = createSupabaseServerClient();
  const { data: books } = await supabase
    .from("books")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-text-meta">Gerenciamento</h2>
          <p className="text-xl font-medium tracking-oryk text-white uppercase">Biblioteca do Autor</p>
        </div>
        <Link
          href="/admin/books/new"
          className="oryk-button-accent py-3 px-8 text-[10px] uppercase tracking-oryk shadow-[0_10px_30px_rgba(43,255,136,0.1)]"
        >
          + Novo Volume
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books?.map((b: any) => (
          <Link
            key={b.id}
            href={`/admin/books/${b.id}`}
            className="oryk-surface p-6 group transition-all duration-300 oryk-surface-hover border-white/[0.05]"
          >
            <div className="flex flex-col h-full justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-[0.3em] text-text-meta">
                  ID_{b.id.slice(0, 8).toUpperCase()}
                </span>
                <p className="text-sm font-medium text-white group-hover:text-accent transition-colors leading-relaxed">
                  {b.title}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                <span className={`text-[9px] uppercase tracking-oryk flex items-center gap-1.5 font-light ${b.status === 'published' ? 'text-accent' : 'text-text-meta'
                  }`}>
                  <span className={`h-1 w-1 rounded-full ${b.status === 'published' ? 'bg-accent shadow-[0_0_8px_rgba(43,255,136,0.5)]' : 'bg-white/20'
                    }`} />
                  {b.status === 'published' ? 'Publicado' : 'Rascunho'}
                </span>

                <span className="text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  EDITAR →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {books && books.length === 0 ? (
        <div className="py-24 text-center oryk-surface border-dashed">
          <p className="text-xs text-text-meta uppercase tracking-oryk">
            Nenhuma obra encontrada no repositório.
          </p>
        </div>
      ) : null}
    </div>
  );
}
