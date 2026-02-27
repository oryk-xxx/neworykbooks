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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-1">
        <Link
          href={`/admin/books/${props.params.bookId}`}
          className="text-[10px] uppercase tracking-oryk text-accent hover:opacity-70 transition-opacity flex items-center gap-2 mb-4"
        >
          ← Voltar para Índice
        </Link>
        <h1 className="text-[10px] uppercase tracking-[0.3em] text-text-meta">Editor de Conteúdo</h1>
        <p className="text-xl font-medium tracking-oryk text-white uppercase">Sincronizar Página</p>
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
