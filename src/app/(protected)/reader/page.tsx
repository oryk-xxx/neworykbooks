import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function ReaderHomePage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const { data: entitlement } = await supabase
    .from("entitlements")
    .select("*")
    .eq("user_id", session.user.id)
    .maybeSingle();

  const hasAccess = entitlement?.active === true;

  const { data: books } = hasAccess
    ? await supabase
        .from("books")
        .select("id, title, cover_url, summary, tags, average_rating, status")
        .order("created_at", { ascending: true })
    : { data: [] as any[] };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Sua biblioteca ØRYK
        </h1>
        <p className="text-xs text-zinc-400">
          Leitura guiada, ritmo próprio, nenhuma distração.
        </p>
      </header>

      {!hasAccess ? (
        <div className="rounded-2xl border border-accent/40 bg-accentMuted/40 p-4 text-sm text-zinc-100">
          <p className="mb-2 font-medium">
            Acesso bloqueado · é necessário completar o pagamento único de R$7.
          </p>
          <p className="mb-3 text-xs text-zinc-200">
            O acesso é vitalício. Assim que o pagamento PIX for aprovado, sua
            biblioteca será liberada automaticamente.
          </p>
          <Link
            href="/checkout"
            className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-xs font-medium text-black"
          >
            Ir para o pagamento PIX
          </Link>
        </div>
      ) : null}

      {hasAccess ? (
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-zinc-200">Livros disponíveis</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {books?.map((book) => (
              <Link
                key={book.id}
                href={`/reader/books/${book.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-borderSubtle/80 bg-black/60 transition hover:border-accent/60"
              >
                <div className="flex-1 space-y-3 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Livro
                  </p>
                  <p className="text-sm font-medium text-zinc-100 group-hover:text-accent">
                    {book.title}
                  </p>
                  {book.summary ? (
                    <p className="text-xs text-zinc-400 line-clamp-3">
                      {book.summary}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-2 text-[10px] text-zinc-400">
                    {book.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accentMuted/60 px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
            {books && books.length === 0 ? (
              <p className="text-xs text-zinc-500">
                Nenhum livro publicado ainda. O admin deve criar livros pelo painel.
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
