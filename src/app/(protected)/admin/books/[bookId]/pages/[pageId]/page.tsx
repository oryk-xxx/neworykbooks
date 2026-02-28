import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageEditorForm } from "@/components/admin/PageEditorForm";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { PageContent } from "@/lib/blocks";

export default async function EditPage(props: {
  params: { bookId: string; pageId: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: page } = await supabase
    .from("pages")
    .select("id, slug, order_index, content")
    .eq("id", props.params.pageId)
    .maybeSingle();

  if (!page) notFound();

  const content = page.content as unknown as PageContent;

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-4">
        <Link
          href={`/admin/books/${props.params.bookId}`}
          className="font-mono text-[9px] uppercase tracking-oryk-wide text-primary hover:opacity-70 transition-opacity flex items-center gap-2 mb-6"
        >
          ← RETORNAR_AO_ÍNDICE_TRANSMISSÕES
        </Link>
        <h1 className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50">EDITOR_UNIDADE_SUBSTITUIÇÃO</h1>
        <p className="text-header text-white uppercase">Sincronizar.Unidade_Sequencial</p>
      </div>

      <PageEditorForm
        bookId={props.params.bookId}
        page={{
          id: page.id,
          slug: page.slug,
          order_index: page.order_index,
          content: content
        }}
        action={`/admin/books/${props.params.bookId}/pages/${page.id}/save`}
      />
    </div>
  );
}
