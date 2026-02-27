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

    return (
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="oryk-surface p-8 space-y-8">
                <form action={action} method="post" className="space-y-8">
                    <div className="grid grid-cols-[2fr_1fr] gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-text-meta font-medium ml-1">
                                Slug de URL
                            </label>
                            <input
                                name="slug"
                                required
                                placeholder="introducao-ao-vazio"
                                className="oryk-input"
                                defaultValue={page?.slug}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-text-meta font-medium ml-1">
                                Ordem
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
                        <label className="text-[9px] uppercase tracking-[0.2em] text-text-meta font-medium ml-1">
                            Arquitetura de Blocos
                        </label>
                        <div className="border border-white/[0.03] rounded-2xl bg-black/40 p-1">
                            <BlockEditor
                                initialValue={content}
                                onChange={setContent}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="oryk-button-accent w-full py-4 text-[11px] uppercase tracking-[0.2em] font-semibold"
                        >
                            {page ? "Sincronizar Alterações →" : "Gerar Nova Página →"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.03] pb-4">
                    <div className="space-y-1">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-text-meta">Preview</h3>
                        <p className="text-sm font-light text-white/40">Renderização em Tempo Real</p>
                    </div>
                </div>
                <div className="oryk-surface p-8 min-h-[600px] bg-black/20 shadow-inner">
                    <div className="prose prose-invert prose-oryk max-w-none">
                        <BlockRenderer blocks={content.blocks} />
                    </div>
                </div>
            </div>
        </div>
    );
}
