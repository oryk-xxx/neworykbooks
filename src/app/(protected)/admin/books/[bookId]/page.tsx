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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-200">{book.title}</h2>
        <form action={`/admin/books/${book.id}/publish`} method="post">
          <button
            type="submit"
            className="rounded-full border border-accent/60 bg-accent/10 px-3 py-1 text-[11px] text-accent"
          >
            {book.status === "published" ? "Despublicar" : "Publicar"}
          </button>
        </form>
      </div>
      <div className="flex items-center justify-between text-xs">
        <p className="text-zinc-400">Páginas</p>
        <Link
          href={`/admin/books/${book.id}/pages/new`}
          className="text-accent"
        >
          Nova página
        </Link>
      </div>
      <div className="space-y-2">
        {pages?.map((p) => (
          <Link
            key={p.id}
            href={`/admin/books/${book.id}/pages/${p.id}`}
            className="flex items-center justify-between rounded-xl border border-borderSubtle/80 bg-black/60 p-3 text-xs text-zinc-200"
          >
            <span>
              #{p.order_index} · {p.slug}
            </span>
            <span className="text-accent">editar</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
