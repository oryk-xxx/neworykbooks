import React from "react";
import Link from "next/link";
import { PageEditorForm } from "@/components/admin/PageEditorForm";

export default async function NewPage(props: { params: { bookId: string } }) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-1">
        <Link
          href={`/admin/books/${props.params.bookId}`}
          className="text-[10px] uppercase tracking-oryk text-accent hover:opacity-70 transition-opacity flex items-center gap-2 mb-4"
        >
          ← Voltar para Índice
        </Link>
        <h1 className="text-[10px] uppercase tracking-[0.3em] text-text-meta">Novo Recurso</h1>
        <p className="text-xl font-medium tracking-oryk text-white uppercase">Adicionar Nova Página</p>
      </div>

      <PageEditorForm
        bookId={props.params.bookId}
        action={`/admin/books/${props.params.bookId}/pages/new/action`}
      />
    </div>
  );
}
