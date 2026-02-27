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
        <div className="grid gap-6 md:grid-cols-2">
            <form action={action} method="post" className="space-y-3">
                <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500">Slug</label>
                        <input
                            name="slug"
                            required
                            placeholder="slug-da-pagina"
                            className="w-full rounded border border-borderSubtle/70 bg-black/60 px-2 py-1 text-sm text-zinc-200 focus:border-accent/60 focus:outline-none"
                            defaultValue={page?.slug}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500">Ordem</label>
                        <input
                            name="order_index"
                            type="number"
                            required
                            className="w-full rounded border border-borderSubtle/70 bg-black/60 px-2 py-1 text-sm text-zinc-200 focus:border-accent/60 focus:outline-none"
                            defaultValue={page?.order_index ?? 1}
                        />
                    </div>
                </div>

                <input
                    type="hidden"
                    name="content_json"
                    value={JSON.stringify(content)}
                />

                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">Editor de Blocos</label>
                    <BlockEditor
                        initialValue={content}
                        onChange={setContent}
                    />
                </div>

                <button
                    type="submit"
                    className="mt-4 inline-flex items-center rounded-full bg-accent px-6 py-2 text-xs font-semibold text-black transition-transform hover:scale-105 active:scale-95"
                >
                    {page ? "Salvar Alterações" : "Criar Nova Página"}
                </button>
            </form>

            <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Preview em tempo real</p>
                <div className="min-h-[400px] rounded-2xl border border-borderSubtle/80 bg-black/20 p-6 shadow-inner">
                    <BlockRenderer blocks={content.blocks} />
                </div>
            </div>
        </div>
    );
}
