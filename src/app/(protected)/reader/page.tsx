import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function ReaderHomePage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: entitlement } = await supabase
    .from("entitlements")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const hasAccess = entitlement?.active === true;

  const { data: books } = hasAccess
    ? await supabase
      .from("books")
      .select("id, title, cover_url, summary, tags, average_rating, status")
      .order("created_at", { ascending: true })
    : { data: [] as any[] };

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-oryk-wide text-white uppercase">
          Biblioteca
        </h1>
        <p className="text-sm text-text-secondary tracking-oryk uppercase">
          Seu acervo de conhecimento refinado
        </p>
      </header>

      {!hasAccess ? (
        <div className="oryk-surface p-8 border-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <p className="text-xs font-medium uppercase tracking-oryk text-accent">
              Acesso Restrito
            </p>
          </div>
          <p className="mb-6 text-sm text-text-secondary leading-relaxed">
            Sua biblioteca está aguardando a liberação. Complete o pagamento único para desbloquear o acervo completo vitaliciamente.
          </p>
          <Link
            href="/checkout"
            className="oryk-button-accent py-3 px-8 text-[10px] uppercase tracking-oryk shadow-[0_10px_30px_rgba(43,255,136,0.15)]"
          >
            Ir para o Checkout
          </Link>
        </div>
      ) : null}

      {hasAccess ? (
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
            <h2 className="text-xs font-medium uppercase tracking-oryk-wide text-text-meta">
              Publicações Disponíveis
            </h2>
            <span className="text-[10px] text-text-meta tracking-oryk">
              {books?.length || 0} OBRA(S)
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {books?.map((book) => (
              <Link
                key={book.id}
                href={`/reader/books/${book.id}`}
                className="oryk-surface oryk-surface-hover group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-text-meta">
                      Edição Digital
                    </span>
                    <span className="text-[10px] text-accent tracking-oryk opacity-0 group-hover:opacity-100 transition-opacity">
                      LER AGORA →
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-white group-hover:text-accent transition-colors">
                      {book.title}
                    </h3>
                    {book.summary ? (
                      <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed font-light">
                        {book.summary}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {book.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[9px] uppercase tracking-oryk text-text-meta border border-white/[0.05] rounded-md px-2 py-0.5 bg-white/[0.02]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}

            {books && books.length === 0 ? (
              <div className="col-span-full py-20 text-center oryk-surface border-dashed">
                <p className="text-xs text-text-meta uppercase tracking-oryk">
                  Nenhum livro publicado até o momento.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
