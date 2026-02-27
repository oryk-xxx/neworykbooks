import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function BookPagesIndex(props: {
  params: { bookId: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: book } = await supabase
    .from("books")
    .select("id, title, status")
    .eq("id", props.params.bookId)
    .maybeSingle();
  if (!book) return null;

  const { data: pages } = await supabase
    .from("pages")
    .select("id, slug, order_index")
    .eq("book_id", book.id)
    .order("order_index", { ascending: true });

  const { data: prog } = await supabase
    .from("progress")
    .select("page_id, unlocked, score")
    .eq("user_id", user.id)
    .eq("book_id", book.id);

  const unlockedSet = new Set<string>();
  for (const p of prog || []) if (p.unlocked) unlockedSet.add(p.page_id);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold tracking-tight">{book.title}</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {pages?.map((p) => {
          const unlocked = p.order_index === 1 || unlockedSet.has(p.id);
          return (
            <Link
              key={p.id}
              href={`/reader/books/${book.id}/${p.slug}`}
              className={`rounded-xl border bg-black/60 p-3 text-xs ${unlocked
                ? "border-borderSubtle/80 text-zinc-200"
                : "border-zinc-800 text-zinc-500"
                }`}
            >
              <div className="flex items-center justify-between">
                <span>Página {p.order_index}</span>
                {!unlocked ? (
                  <span className="rounded-full border border-zinc-700 px-2 py-0.5">
                    Bloqueada
                  </span>
                ) : (
                  <span className="rounded-full border border-emerald-700/60 px-2 py-0.5 text-emerald-300">
                    Liberada
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
