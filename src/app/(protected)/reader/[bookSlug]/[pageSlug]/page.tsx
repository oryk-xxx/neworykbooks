import React from "react";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/editor/BlockRenderer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { PageContent } from "@/lib/blocks";
import { AntiLeakGuard } from "@/components/AntiLeakGuard";

export default async function ReaderPage(props: {
    params: { bookSlug: string; pageSlug: string };
}) {
    const supabase = createSupabaseServerClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch book by slug
    const { data: book } = await supabase
        .from("books")
        .select("id, status, title, slug")
        .eq("slug", props.params.bookSlug)
        .maybeSingle();

    if (!book) {
        notFound();
    }

    // Fetch page by bookId and pageSlug
    const { data: page } = await supabase
        .from("pages")
        .select("id, book_id, slug, order_index, content, estimated_read_time_minutes")
        .eq("book_id", book.id)
        .ilike("slug", props.params.pageSlug)
        .maybeSingle();

    if (!page) {
        return (
            <div className="max-w-3xl mx-auto py-20 text-center space-y-6">
                <h1 className="text-header text-white uppercase">Access.Denied</h1>
                <p className="font-mono text-sm text-text-secondary uppercase opacity-70">
                    Protocol requirement: Active entitlement not detected or sector does not exist.
                </p>
                <div className="pt-8">
                    <a href="/reader" className="oryk-button-accent py-3 px-8 text-[10px]">
                        RETURN_TO_TERMINAL
                    </a>
                </div>
            </div>
        );
    }

    const { data: progress } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("page_id", page.id)
        .maybeSingle();

    const unlocked = progress?.unlocked === true || page.order_index === 1;

    const content = page.content as PageContent;
    const watermark = `${user.id.slice(0, 8)} · ${new Date()
        .toISOString()
        .slice(0, 19)} · ØRYK`;

    return (
        <div className="max-w-3xl mx-auto space-y-20">
            <AntiLeakGuard watermark={watermark} />

            <article className="prose prose-invert prose-oryk max-w-none">
                <header className="mb-16 border-b border-white/[0.06] pb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-primary">Sector.{String(page.order_index).padStart(2, '0')}</span>
                        <span className="h-px w-12 bg-white/[0.06]" />
                        <span className="font-mono text-[9px] uppercase tracking-oryk text-text-meta opacity-50">{page.estimated_read_time_minutes || 5} PROCESS_TIME.MIN</span>
                    </div>
                    <h1 className="text-header text-white tracking-tight leading-tight">
                        {page.slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h1>
                </header>

                <div className="font-mono text-base text-text-secondary leading-relaxed uppercase opacity-80 selection:bg-primary/20">
                    <BlockRenderer blocks={content.blocks} watermark="" />
                </div>
            </article>

            <div className="pt-16 border-t border-white/[0.05]">
                <SummaryForm
                    bookId={String(page.book_id)}
                    pageId={String(page.id)}
                    nextSlug=""
                    unlocked={unlocked}
                    bookSlug={book.slug}
                />
            </div>
        </div>
    );
}

function SummaryForm(props: {
    bookId: string;
    pageId: string;
    nextSlug: string;
    unlocked: boolean;
    bookSlug: string;
}) {
    const disabled = !props.unlocked;
    return (
        <div className="oryk-surface p-12 space-y-10 relative overflow-hidden bg-primary/2">
            <div className="space-y-3">
                <h3 className="text-header-sm text-white">Sync.Knowledge_Core</h3>
                <p className="font-mono text-[10px] text-text-secondary tracking-oryk leading-relaxed uppercase opacity-60">
                    Terminal requires conceptual synthesis for sector progression. <br />
                    System requirement: Minimum 80 units of synthesis.
                </p>
            </div>

            <form action="/api/progress/submit" method="post" className="space-y-8">
                <input type="hidden" name="book_id" value={props.bookId} />
                <input type="hidden" name="page_id" value={props.pageId} />

                <div className="relative group">
                    <textarea
                        name="summary"
                        required
                        disabled={disabled}
                        minLength={80}
                        className="oryk-input min-h-[200px] py-6 text-sm leading-relaxed resize-none transition-all duration-300 focus:ring-1 focus:ring-primary/20"
                        placeholder="[ INPUT SYNTHESIS DATA HERE ]"
                    />
                    <div className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-oryk text-text-meta pointer-events-none group-focus-within:text-primary transition-colors opacity-40">
                        SYNT_MODE_ACTIVE // UPLINK_STANDBY
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 pt-4">
                    <button
                        type="submit"
                        disabled={disabled}
                        className={`oryk-button-accent py-4 px-12 text-[10px] w-full sm:w-auto ${disabled ? "opacity-20 cursor-not-allowed grayscale" : ""
                            }`}
                    >
                        VALIDATE COGNITION →
                    </button>

                    {disabled && (
                        <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/20 animate-pulse" />
                            <p className="text-[9px] text-text-meta uppercase tracking-oryk opacity-50">
                                Access pending protocol completion. Sector lock active.
                            </p>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
