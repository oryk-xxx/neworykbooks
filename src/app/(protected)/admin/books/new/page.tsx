import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function NewBookPage() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.getUser();

  return (
    <form action="/admin/books/new/action" method="post" className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs text-zinc-300">Título</label>
        <input
          name="title"
          required
          className="w-full rounded border border-borderSubtle/70 bg-black/60 px-2 py-1 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-zinc-300">Resumo</label>
        <textarea
          name="summary"
          className="min-h-[80px] w-full rounded border border-borderSubtle/70 bg-black/60 px-2 py-1 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-zinc-300">Tags (separadas por vírgula)</label>
        <input
          name="tags"
          className="w-full rounded border border-borderSubtle/70 bg-black/60 px-2 py-1 text-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-xs font-medium text-black"
      >
        Criar livro
      </button>
    </form>
  );
}
