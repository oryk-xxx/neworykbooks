import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { BlockEditor } from "components/editor/BlockEditor";

export default async function NewPage(props: { params: { bookId: string } }) {
  const supabase = createSupabaseServerClient();
  await supabase.auth.getSession();
  const orderIndex = 1;

  return (
    <form action={`/admin/books/${props.params.bookId}/pages/new/action`} method="post" className="space-y-4">
      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <div className="space-y-2">
          <label className="text-xs text-zinc-300">Slug</label>
          <input
            name="slug"
            required
            className="w-full rounded border border-borderSubtle/70 bg-black/60 px-2 py-1 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-zinc-300">Ordem</label>
          <input
            name="order_index"
            type="number"
            defaultValue={orderIndex}
            className="w-full rounded border border-borderSubtle/70 bg-black/60 px-2 py-1 text-sm"
          />
        </div>
      </div>
      <input type="hidden" name="content_json" id="content_json" />
      <BlockEditor
        onChange={(value) => {
          const el = document.getElementById("content_json") as HTMLInputElement | null;
          if (el) el.value = JSON.stringify(value);
        }}
      />
      <button
        type="submit"
        className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-xs font-medium text-black"
      >
        Criar página
      </button>
    </form>
  );
}
