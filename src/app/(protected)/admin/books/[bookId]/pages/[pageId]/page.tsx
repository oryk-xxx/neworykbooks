import { notFound } from "next/navigation";
import { BlockRenderer } from "components/editor/BlockRenderer";
import { BlockEditor } from "components/editor/BlockEditor";
import { createSupabaseServerComponentClient } from "lib/supabaseServer";
import type { PageContent } from "lib/blocks";

export default async function EditPage(props: {
  params: { bookId: string; pageId: string };
}) {
  const supabase = createSupabaseServerComponentClient();
  const { data: page } = await supabase
    .from("pages")
    .select("id, slug, order_index, content")
    .eq("id", props.params.pageId)
    .maybeSingle();
  if (!page) notFound();

  const content = page.content as PageContent;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form
        action={`/admin/books/${props.params.bookId}/pages/${page.id}/save`}
        method="post"
        className="space-y-3"
      >
        <div className="grid grid-cols-[2fr_1fr] gap-2">
          <input
            name="slug"
            className="w-full rounded border border-borderSubtle/70 bg-black/60 px-2 py-1 text-sm"
            defaultValue={page.slug}
          />
          <input
            name="order_index"
            type="number"
            className="w-full rounded border border-borderSubtle/70 bg-black/60 px-2 py-1 text-sm"
            defaultValue={page.order_index}
          />
        </div>
        <input type="hidden" id="content_json" name="content_json" />
        <BlockEditor
          initialValue={content}
          onChange={(value) => {
            const el = document.getElementById("content_json") as HTMLInputElement | null;
            if (el) el.value = JSON.stringify(value);
          }}
        />
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-xs font-medium text-black"
        >
          Salvar
        </button>
      </form>
      <div>
        <p className="mb-2 text-xs text-zinc-500">Preview</p>
        <div className="rounded-xl border border-borderSubtle/80 bg-black/60 p-3">
          <BlockRenderer blocks={content.blocks} />
        </div>
      </div>
    </div>
  );
}
