import React from "react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function AdminBooksPage() {
  const supabase = createSupabaseServerClient();
  const { data: books } = await supabase
    .from("books")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <h2 className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50">ADMIN_CONTROL_LAYER</h2>
          <p className="text-header text-white uppercase">Archive.Repository</p>
        </div>
        <Link
          href="/admin/books/new"
          className="oryk-button-accent py-4 px-10 text-[10px] uppercase font-bold self-start md:self-auto"
        >
          INIT_NEW_ENTRY +
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books?.map((b: any) => (
          <Link
            key={b.id}
            href={`/admin/books/${b.id}`}
            className="oryk-surface p-8 group transition-all duration-500 overflow-hidden relative"
          >
            <div className="flex flex-col h-full justify-between gap-8">
              <div className="space-y-3">
                <span className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-40">
                  ENTITY_ID: {b.id.slice(0, 8).toUpperCase()}
                </span>
                <p className="font-sans text-base font-medium text-white group-hover:text-primary transition-colors leading-snug uppercase">
                  {b.title}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/[0.04]">
                <span className={`font-mono text-[9px] uppercase tracking-oryk flex items-center gap-2 ${b.status === 'published' ? 'text-primary' : 'text-text-secondary opacity-60'
                  }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${b.status === 'published' ? 'bg-primary shadow-[0_0_10px_rgba(43,255,136,0.4)]' : 'bg-white/20'
                    }`} />
                  {b.status === 'published' ? 'OPERATIONAL' : 'DEVELOPMENT'}
                </span>

                <span className="font-mono text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  ACCESS_SYSTEM →
                </span>
              </div>
            </div>

            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <span className="font-mono text-[40px] leading-none select-none">Ø</span>
            </div>
          </Link>
        ))}
      </div>

      {books && books.length === 0 ? (
        <div className="py-32 text-center oryk-surface border-dashed opacity-50">
          <p className="font-mono text-[10px] text-text-secondary uppercase tracking-oryk-wide">
            REPOSITORY_VACANCY: NO ENTRIES FOUND
          </p>
        </div>
      ) : null}
    </div>
  );
}
