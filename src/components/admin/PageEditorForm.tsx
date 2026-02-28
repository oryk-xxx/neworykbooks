"use client";

import { useState } from "react";
import { BlockEditor } from "@/components/editor/BlockEditor";
import { BlockRenderer } from "@/components/editor/BlockRenderer";
import type { PageContent } from "@/lib/blocks";

interface Props {
    bookId: string;
    page?: {
        id: string;
        slug: string;
        order_index: number;
        content: PageContent;
    };
    action: string;
}

export function PageEditorForm({ bookId, page, action }: Props) {
    const [content, setContent] = useState<PageContent>(
        page?.content || {
            blocks: [
                {
                    id: "initial-heading",
                    type: "heading",
                    data: { level: 2, text: "Título da página" }
                },
                {
                    id: "initial-p",
                    type: "paragraph",
                    data: { text: "Comece a escrever aqui..." }
                }
            ]
        }
    );
    const [mode, setMode] = useState<"edit" | "preview">("edit");
    const [slug, setSlug] = useState(page?.slug || "");

    const handleSlugChange = (value: string) => {
        const transformed = value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove accents
            .replace(/[^a-z0-9\s-]/g, "") // remove special chars
            .trim()
            .replace(/\s+/g, "-"); // spaces to hyphens
        setSlug(transformed);
    };

    return (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
                <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-lg w-fit">
                    <button
                        type="button"
                        onClick={() => setMode("edit")}
                        className={`px-6 py-2 text-[10px] font-mono tracking-oryk uppercase rounded-md transition-all ${mode === "edit" ? "bg-primary text-black font-bold shadow-[glow]" : "text-text-secondary hover:text-white"
                            }`}
                    >
                        EDITOR.CORE
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("preview")}
                        className={`px-6 py-2 text-[10px] font-mono tracking-oryk uppercase rounded-md transition-all ${mode === "preview" ? "bg-primary text-black font-bold shadow-[glow]" : "text-text-secondary hover:text-white"
                            }`}
                    >
                        MODO.HIPERVIEW
                    </button>
                </div>

                <div className="oryk-surface p-10 space-y-10">
                    <form action={action} method="post" className="space-y-10">
                        {mode === "edit" ? (
                            <>
                                <div className="grid grid-cols-[2fr_1fr] gap-6">
                                    <div className="space-y-3">
                                        <label className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50 ml-1">
                                            SLUG_DE_TRANSMISSÃO
                                        </label>
                                        <input
                                            name="slug"
                                            required
                                            placeholder="entry-protocol-01"
                                            className="oryk-input"
                                            value={slug}
                                            onChange={(e) => handleSlugChange(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50 ml-1">
                                            ÍNDICE_DE_SEQUÊNCIA
                                        </label>
                                        <input
                                            name="order_index"
                                            type="number"
                                            required
                                            className="oryk-input"
                                            defaultValue={page?.order_index ?? 1}
                                        />
                                    </div>
                                </div>

                                <input
                                    type="hidden"
                                    name="content_json"
                                    value={JSON.stringify(content)}
                                />

                                <div className="space-y-4">
                                    <label className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50 ml-1">
                                        MATRIZ_DE_BLOCOS
                                    </label>
                                    <div className="border border-white/[0.04] rounded-xl bg-black/40 p-2 shadow-inner">
                                        <BlockEditor
                                            initialValue={content}
                                            onChange={setContent}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <header className="pb-8 border-b border-white/[0.06]">
                                    <p className="font-mono text-[10px] text-primary uppercase tracking-[0.3em] mb-2">Protocolo.Hiperview.Ativo</p>
                                    <h1 className="text-3xl font-medium text-white tracking-tight">
                                        {slug.replace(/-/g, ' ').toUpperCase()}
                                    </h1>
                                </header>
                                <div className="prose prose-invert prose-oryk max-w-none">
                                    <BlockRenderer blocks={content.blocks} />
                                </div>
                                <input type="hidden" name="slug" value={slug} />
                                <input type="hidden" name="order_index" value={page?.order_index ?? 1} />
                                <input type="hidden" name="content_json" value={JSON.stringify(content)} />
                            </div>
                        )}

                        <div className="pt-6 border-t border-white/[0.06]">
                            <button
                                type="submit"
                                className="oryk-button-accent w-full py-5 text-[11px] uppercase font-bold tracking-oryk-wide"
                            >
                                {page ? "SINCRONIZAR_UPLINK →" : "INICIAR_NOVA_UNIDADE →"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="space-y-6 hidden lg:block">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-6">
                    <div className="space-y-2">
                        <h3 className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50">MONITOR_UPLINK_TEMPOREAL</h3>
                        <p className="text-sm font-light text-white/40 italic">Prévia de decriptação ao vivo</p>
                    </div>
                </div>
                <div className="oryk-surface p-10 min-h-[600px] border-white/[0.04] bg-black/[0.15]">
                    <div className="prose prose-invert prose-oryk max-w-none">
                        <BlockRenderer blocks={content.blocks} />
                    </div>
                </div>
            </div>
        </div>
    );
}
