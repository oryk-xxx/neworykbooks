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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <Link
            href="/reader"
            className="text-[10px] uppercase tracking-oryk text-text-meta hover:text-white transition-colors"
          >
            ← Voltar para Biblioteca
          </Link>
        </div>

        <div className="space-y-1">
          <h1 className="text-4xl font-medium tracking-oryk-wide text-white uppercase leading-tight max-w-2xl">
            {book.title}
          </h1>
          <div className="flex items-center gap-3 pt-2">
            <span className="h-1 w-1 rounded-full bg-accent" />
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">
              Índice de Conteúdo
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages?.map((p) => {
          const unlocked = p.order_index === 1 || unlockedSet.has(p.id);
          return (
            <Link
              key={p.id}
              href={`/reader/books/${book.id}/${p.slug}`}
              className={`oryk-surface p-6 group transition-all duration-300 ${unlocked
                  ? "oryk-surface-hover border-white/[0.05]"
                  : "opacity-40 cursor-not-allowed border-dashed border-white/[0.03]"
                }`}
              onClick={(e) => !unlocked && e.preventDefault()}
            >
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-text-meta">
                    Página {String(p.order_index).padStart(2, '0')}
                  </span>
                  <p className={`text-sm font-medium transition-colors ${unlocked ? "text-white group-hover:text-accent" : "text-text-meta"
                    }`}>
                    {p.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {!unlocked ? (
                    <span className="text-[9px] uppercase tracking-oryk text-text-meta flex items-center gap-1.5 font-light">
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      Conteúdo Bloqueado
                    </span>
                  ) : (
                    <span className="text-[9px] uppercase tracking-oryk text-accent flex items-center gap-1.5 font-light">
                      <span className="h-1 w-1 rounded-full bg-accent shadow-[0_0_8px_rgba(43,255,136,0.5)]" />
                      Disponível
                    </span>
                  )}
                  {unlocked && (
                    <span className="text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      LER →
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {pages && pages.length === 0 ? (
        <div className="py-24 text-center oryk-surface border-dashed">
          <p className="text-xs text-text-meta uppercase tracking-oryk">
            Este volume ainda não contém páginas publicadas.
          </p>
        </div>
      ) : null}
    </div>
  );
}
