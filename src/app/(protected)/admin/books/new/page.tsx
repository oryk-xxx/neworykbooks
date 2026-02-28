import React from "react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function NewBookPage() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.getUser();

  const [slug, setSlug] = React.useState("");

  const handleTitleChange = (title: string) => {
    const transformed = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .trim()
      .replace(/\s+/g, "-"); // spaces to hyphens
    setSlug(transformed);
  };

  return (
    <div className="max-w-xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-4">
        <Link
          href="/admin/books"
          className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2 mb-6"
        >
          ← ABORT_PROTOCOL
        </Link>
        <h2 className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50">NEW_ENTITY_REGISTRATION</h2>
        <p className="text-header text-white uppercase">Initialize.Main_Volume</p>
      </div>

      <div className="oryk-surface p-10">
        <form action="/admin/books/new/action" method="post" className="space-y-10">
          <div className="grid gap-8">
            <div className="space-y-3">
              <label className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50 ml-1">
                VOLUME_TITLE
              </label>
              <input
                name="title"
                required
                placeholder="Ex: SILENCE_PROTOCOL"
                className="oryk-input"
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50 ml-1">
                TRANSMISSION_SLUG
              </label>
              <input
                name="slug"
                required
                placeholder="Ex: silence-protocol"
                className="oryk-input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50 ml-1">
              ABSTRACT_OVERVIEW
            </label>
            <textarea
              name="summary"
              placeholder="High-level summary of entity parameters..."
              className="oryk-input min-h-[140px] resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50 ml-1">
              CLASSIFICATION_TAGS
            </label>
            <input
              name="tags"
              placeholder="Minimalist, Restricted, Control"
              className="oryk-input"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="oryk-button-accent w-full py-5 text-[11px] uppercase font-bold tracking-oryk-wide"
            >
              COMMIT_ENTRY →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
