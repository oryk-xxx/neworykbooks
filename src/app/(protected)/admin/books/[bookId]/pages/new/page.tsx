import React from "react";
import Link from "next/link";
import { PageEditorForm } from "@/components/admin/PageEditorForm";

export default async function NewPage(props: { params: { bookId: string } }) {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-4">
        <Link
          href={`/admin/books/${props.params.bookId}`}
          className="font-mono text-[9px] uppercase tracking-oryk-wide text-primary hover:opacity-70 transition-opacity flex items-center gap-2 mb-6"
        >
          ← RETORNAR_AO_ÍNDICE_TRANSMISSÕES
        </Link>
        <h1 className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50">NOVA_UNIDADE_TRANSMISSÃO</h1>
        <p className="text-header text-white uppercase">Inicializar.Fluxo_Dados</p>
      </div>

      <PageEditorForm
        bookId={props.params.bookId}
        action={`/admin/books/${props.params.bookId}/pages/new/action`}
      />
    </div>
  );
}
