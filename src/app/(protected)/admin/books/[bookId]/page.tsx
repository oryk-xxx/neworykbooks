import React from "react";
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
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Link
            href="/admin/books"
            className="font-mono text-[9px] uppercase tracking-oryk-wide text-primary hover:opacity-70 transition-opacity flex items-center gap-2 mb-6"
          >
            ← RETURN_TO_REPOSITORY
          </Link>
          <p className="text-header text-white uppercase">{book.title}</p>
        </div>

        <form action={`/admin/books/${book.id}/publish`} method="post">
          <button
            type="submit"
            className={`${book.status === "published"
              ? "bg-white/[0.03] border border-white/[0.08] text-white/40 hover:bg-white/[0.06]"
              : "oryk-button-primary"
              } py-4 px-10 text-[10px] uppercase font-bold transition-all duration-300 rounded-xl`}
          >
            {book.status === "published" ? "DEACTIVATE_FEED" : "ACTIVATE_FEED"}
          </button>
        </form>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-6">
          <div className="space-y-2">
            <h3 className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50">TRANSMISSION_INDEX</h3>
            <p className="text-sm font-light text-white/40 italic">Sequential data stream units</p>
          </div>
          <Link
            href={`/admin/books/${book.id}/pages/new`}
            className="font-mono text-[9px] uppercase tracking-oryk-wide text-primary hover:text-white transition-all flex items-center gap-2"
          >
            INIT_NEW_TRANSMISSION +
          </Link>
        </div>

        <div className="grid gap-4">
          {pages?.map((p: any) => (
            <Link
              key={p.id}
              href={`/admin/books/${book.id}/pages/${p.id}`}
              className="oryk-surface p-5 flex items-center justify-between group transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center gap-6">
                <span className="font-mono text-[10px] text-text-secondary opacity-30 w-8">
                  #{p.order_index.toString().padStart(2, '0')}
                </span>
                <span className="font-sans text-sm font-medium text-white group-hover:text-primary transition-colors uppercase">
                  {p.slug}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-mono text-[9px] uppercase tracking-oryk text-text-secondary opacity-0 group-hover:opacity-40 transition-all transform translate-x-2 group-hover:translate-x-0 hidden sm:block">
                  UNIT_CONFIG // ACCESS
                </span>
                <span className="font-mono text-[9px] text-primary font-bold group-hover:tracking-widest transition-all">
                  MOD_01 →
                </span>
              </div>

              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}

          {pages && pages.length === 0 && (
            <div className="py-20 text-center oryk-surface border-dashed opacity-40">
              <p className="font-mono text-[10px] text-text-secondary uppercase tracking-oryk-wide">
                TRANSMISSION_GAP: NO DATA UNITS DETECTED
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
