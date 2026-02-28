import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function BookPagesIndex(props: {
    params: { bookSlug: string };
}) {
    const supabase = createSupabaseServerClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: book } = await supabase
        .from("books")
        .select("id, title, status, slug")
        .eq("slug", props.params.bookSlug)
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
        <div className="space-y-12 max-w-7xl mx-auto">
            <header className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/reader"
                        className="text-[10px] uppercase tracking-oryk text-text-meta hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <span className="opacity-50">←</span> TERMINAL.RETURN
                    </Link>
                </div>

                <div className="space-y-2">
                    <h1 className="text-header text-white leading-tight max-w-3xl">
                        {book.title}
                    </h1>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <p className="text-label text-primary">
                            Index.Transmissions
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pages?.map((p: any) => {
                    const unlocked = p.order_index === 1 || unlockedSet.has(p.id);
                    const cardContent = (
                        <div className="flex flex-col h-full justify-between gap-6">
                            <div className="space-y-2">
                                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-meta block">
                                    Sector.{String(p.order_index).padStart(2, '0')}
                                </span>
                                <p className={`text-base font-medium transition-colors tracking-tight ${unlocked ? "text-white group-hover:text-primary" : "text-text-meta"
                                    }`}>
                                    {p.slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                                {!unlocked ? (
                                    <span className="text-[9px] uppercase tracking-oryk text-text-meta flex items-center gap-2 font-light">
                                        <span className="h-1 w-1 rounded-full bg-white/20" />
                                        Data.Restricted
                                    </span>
                                ) : (
                                    <span className="text-[9px] uppercase tracking-oryk text-primary flex items-center gap-2 font-light">
                                        <span className="h-1 w-1 rounded-full bg-primary shadow-[0_0_10px_rgba(43,255,136,0.3)]" />
                                        Data.Resolved
                                    </span>
                                )}
                                {unlocked && (
                                    <span className="font-mono text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        DOWNLOAD →
                                    </span>
                                )}
                            </div>
                        </div>
                    );

                    const cardClassName = `oryk-surface p-8 group relative overflow-hidden transition-all duration-300 ${unlocked
                        ? "oryk-surface-hover border-white/[0.06]"
                        : "opacity-40 cursor-not-allowed border-dashed border-white/[0.04]"
                        }`;

                    if (unlocked) {
                        return (
                            <Link
                                key={p.id}
                                href={`/reader/${book.slug}/${p.slug}`}
                                className={cardClassName}
                            >
                                {cardContent}
                            </Link>
                        );
                    }

                    return (
                        <div key={p.id} className={cardClassName}>
                            {cardContent}
                        </div>
                    );
                })}
            </div>

            {pages && pages.length === 0 ? (
                <div className="py-24 text-center oryk-surface border-dashed border-white/[0.06]">
                    <p className="text-label opacity-40">
                        Sector is currently void. No transmissions recorded.
                    </p>
                </div>
            ) : null}
        </div>
    );
}
