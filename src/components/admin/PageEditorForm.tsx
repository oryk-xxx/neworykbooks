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
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="oryk-surface p-10 space-y-10">
                <form action={action} method="post" className="space-y-10">
                    <div className="grid grid-cols-[2fr_1fr] gap-6">
                        <div className="space-y-3">
                            <label className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50 ml-1">
                                TRANSMISSION_SLUG
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
                                SEQUENCE_INDEX
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
                            STRUCTURE_BLOCK_ARRAY
                        </label>
                        <div className="border border-white/[0.04] rounded-xl bg-black/40 p-2 shadow-inner">
                            <BlockEditor
                                initialValue={content}
                                onChange={setContent}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="oryk-button-accent w-full py-5 text-[11px] uppercase font-bold tracking-oryk-wide"
                        >
                            {page ? "UPLINK_SYNCHRONIZATION →" : "INIT_NEW_UNIT →"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-6">
                    <div className="space-y-2">
                        <h3 className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary opacity-50">REALTIME_UPLINK_MONITOR</h3>
                        <p className="text-sm font-light text-white/40 italic">Live decryption preview</p>
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
