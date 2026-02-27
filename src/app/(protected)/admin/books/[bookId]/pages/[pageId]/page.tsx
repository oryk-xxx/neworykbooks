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
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-100">Editar Página</h1>
        <p className="text-xs text-zinc-500">Modifique o conteúdo e a ordem da página.</p>
      </header>

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
