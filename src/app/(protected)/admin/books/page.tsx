import Link from "next/link";
import { createSupabaseServerComponentClient } from "lib/supabaseServer";

export default async function AdminBooksPage() {
  const supabase = createSupabaseServerComponentClient();
  const { data: books } = await supabase
    .from("books")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-200">Livros</h2>
        <Link
          href="/admin/books/new"
          className="rounded-full border border-accent/60 bg-accent/10 px-3 py-1 text-[11px] text-accent"
        >
          Novo livro
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {books?.map((b) => (
          <Link
            key={b.id}
            href={`/admin/books/${b.id}`}
            className="rounded-xl border border-borderSubtle/80 bg-black/60 p-3 text-xs text-zinc-200"
          >
            <div className="flex items-center justify-between">
              <span>{b.title}</span>
              <span className="rounded-full border border-borderSubtle/70 px-2 py-0.5">
                {b.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
