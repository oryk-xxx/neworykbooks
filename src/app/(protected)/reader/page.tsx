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
      .select("id, slug, title, cover_url, summary, tags, average_rating, status")
      .order("created_at", { ascending: true })
    : { data: [] as any[] };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header className="space-y-4">
        <h1 className="text-header text-primary">Archive.Intel</h1>
        <p className="font-mono text-[9px] tracking-oryk text-text-meta uppercase">Status: Connection established // Authorization: Granted</p>
      </header>

      {!hasAccess ? (
        <div className="oryk-surface p-8 relative overflow-hidden border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-label text-primary">Archive.Restricted</p>
          </div>
          <p className="mb-6 font-mono text-[11px] text-text-secondary leading-relaxed uppercase opacity-70">
            System requires synchronization fee. Terminal access locked until protocol completion.
          </p>
          <Link
            href="/checkout"
            className="oryk-button-accent py-3 px-8 text-[10px]"
          >
            INITIALIZE CHECKOUT →
          </Link>
        </div>
      ) : null}

      {hasAccess ? (
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h2 className="text-label">Available.Transmissions</h2>
            <span className="font-mono text-[9px] text-text-meta tracking-oryk uppercase">
              {books?.length || 0} SECTOR(S) LOADED
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {books?.map((book: any) => (
              <Link
                key={book.id}
                href={`/reader/${book.slug}`}
                className="oryk-surface oryk-surface-hover group relative overflow-hidden"
              >
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-meta">
                      Digital_Nexus_Output
                    </span>
                    <span className="font-mono text-[9px] text-primary tracking-oryk opacity-0 group-hover:opacity-100 transition-opacity">
                      DECRYPT →
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-white group-hover:text-primary transition-colors tracking-tight">
                      {book.title}
                    </h3>
                    {book.summary ? (
                      <p className="font-mono text-[11px] text-text-secondary line-clamp-2 leading-relaxed uppercase opacity-60">
                        {book.summary}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {book.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[9px] uppercase tracking-oryk text-text-meta border border-white/[0.06] rounded px-2 py-0.5 bg-white/[0.02]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}

            {books && books.length === 0 ? (
              <div className="col-span-full py-24 text-center oryk-surface border-dashed border-white/[0.06]">
                <p className="text-label opacity-40">
                  No transmissions found in this sector.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
