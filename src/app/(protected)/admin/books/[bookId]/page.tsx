import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function AdminBookPage(props: { params: { bookId: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("id", props.params.bookId)
    .maybeSingle();
  if (!book) notFound();

  const { data: pages } = await supabase
    .from("pages")
    .select("id, slug, order_index")
    .eq("book_id", book.id)
    .order("order_index", { ascending: true });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/books"
            className="text-[10px] uppercase tracking-oryk text-accent hover:opacity-70 transition-opacity flex items-center gap-2 mb-4"
          >
            ← Voltar para Biblioteca
          </Link>
          <p className="text-xl font-medium tracking-oryk text-white uppercase">{book.title}</p>
        </div>

        <form action={`/admin/books/${book.id}/publish`} method="post">
          <button
            type="submit"
            className={`${book.status === "published"
                ? "oryk-surface-hover border-white/20 text-white/60"
                : "oryk-button-accent"
              } py-3 px-8 text-[10px] uppercase tracking-oryk transition-all duration-300`}
          >
            {book.status === "published" ? "Despublicar Obra" : "Publicar no Feed"}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.03] pb-4">
          <div className="space-y-1">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-text-meta">Conteúdo</h3>
            <p className="text-sm font-light text-white/40">Índice de Páginas e Capítulos</p>
          </div>
          <Link
            href={`/admin/books/${book.id}/pages/new`}
            className="text-[10px] uppercase tracking-oryk text-accent hover:shadow-[0_0_15px_rgba(43,255,136,0.2)] transition-all"
          >
            + Adicionar Página
          </Link>
        </div>

        <div className="grid gap-3">
          {pages?.map((p) => (
            <Link
              key={p.id}
              href={`/admin/books/${book.id}/pages/${p.id}`}
              className="oryk-surface p-4 flex items-center justify-between group oryk-surface-hover border-white/[0.03]"
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-text-meta w-6">
                  {p.order_index.toString().padStart(2, '0')}
                </span>
                <span className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                  {p.slug}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[9px] uppercase tracking-oryk text-text-meta opacity-0 group-hover:opacity-100 transition-opacity">
                  Configurações →
                </span>
                <span className="text-accent text-xs">EDITAR</span>
              </div>
            </Link>
          ))}

          {pages && pages.length === 0 && (
            <div className="py-12 text-center oryk-surface border-dashed">
              <p className="text-xs text-text-meta uppercase tracking-oryk">
                Esta obra ainda não possui páginas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
