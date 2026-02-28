/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import type { Block, PageContent, WrongRightPair } from "../../lib/blocks";
import { v4 as uuid } from "uuid";

interface Props {
  initialValue?: PageContent | null;
  onChange?: (value: PageContent) => void;
}

export function BlockEditor({ initialValue, onChange }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(() =>
    initialValue?.blocks && initialValue.blocks.length > 0
      ? initialValue.blocks
      : [
        {
          id: uuid(),
          type: "heading",
          data: { level: 1, text: "Título da página" }
        },
        {
          id: uuid(),
          type: "paragraph",
          data: {
            text: "Comece a estruturar o conteúdo desta página em blocos claros e objetivos."
          }
        }
      ]
  );

  function updateBlocks(next: Block[]) {
    setBlocks(next);
    onChange?.({ blocks: next });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    updateBlocks(arrayMove(blocks, oldIndex, newIndex));
  }

  function addBlock(type: Block["type"]) {
    const base: any = { id: uuid(), type };
    switch (type) {
      case "heading":
        base.data = { level: 2, text: "Novo título" };
        break;
      case "paragraph":
        base.data = { text: "Novo parágrafo." };
        break;
      case "image":
        base.data = { url: "", caption: "" };
        break;
      case "link":
        base.data = { label: "Abrir recurso", href: "https://" };
        break;
      case "quote":
        base.data = { text: "Uma frase que merece ser isolada.", attribution: "" };
        break;
      case "divider":
        base.data = {};
        break;
      case "list":
        base.data = { style: "bullet", items: ["Primeiro ponto"] };
        break;
      case "callout":
        base.data = { tone: "tip", text: "Uma observação importante para esta parte." };
        break;
      case "embed":
        base.data = { url: "https://", title: "" };
        break;
      case "wrong_right":
        base.data = {
          title: "Exemplos de comunicação",
          pairs: [
            {
              wrong: "mb, faz isso aí",
              right: "Meu bem, consegue me ajudar com isso?",
              category: "postura",
              level: "iniciante",
              explanation:
                "A forma certa traz contexto, respeito e clareza, sem perder proximidade."
            } satisfies WrongRightPair
          ]
        };
        break;
    }
    updateBlocks([...blocks, base]);
  }

  function updateBlock(id: string, data: Partial<Block["data"]>, type?: Block["type"]) {
    updateBlocks(
      blocks.map((block) =>
        block.id === id
          ? {
            ...block,
            ...(type ? { type } : null),
            data: { ...(block.data as any), ...(data as any) }
          }
          : block
      )
    );
  }

  function removeBlock(id: string) {
    updateBlocks(blocks.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs">
        <BlockToolbarButton label="Título" onClick={() => addBlock("heading")} />
        <BlockToolbarButton label="Parágrafo" onClick={() => addBlock("paragraph")} />
        <BlockToolbarButton label="Imagem" onClick={() => addBlock("image")} />
        <BlockToolbarButton label="Link / CTA" onClick={() => addBlock("link")} />
        <BlockToolbarButton label="Citação" onClick={() => addBlock("quote")} />
        <BlockToolbarButton label="Divisor" onClick={() => addBlock("divider")} />
        <BlockToolbarButton label="Lista" onClick={() => addBlock("list")} />
        <BlockToolbarButton label="Callout" onClick={() => addBlock("callout")} />
        <BlockToolbarButton label="Embed" onClick={() => addBlock("embed")} />
        <BlockToolbarButton
          label="Errado → Certo"
          onClick={() => addBlock("wrong_right")}
          accent
        />
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {blocks.map((block) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                onChange={updateBlock}
                onRemove={removeBlock}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

interface SortableBlockItemProps {
  block: Block;
  onChange: (id: string, data: any, type?: Block["type"]) => void;
  onRemove: (id: string) => void;
}

function SortableBlockItem({ block, onChange, onRemove }: SortableBlockItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex gap-3 rounded-xl border border-borderSubtle/80 bg-black/40 p-3"
    >
      <button
        type="button"
        className="mt-3 h-5 w-5 shrink-0 cursor-grab rounded-full border border-borderSubtle/70 text-[10px] text-zinc-500 opacity-70 group-hover:opacity-100"
        {...attributes}
        {...listeners}
      >
        ::
      </button>
      <div className="flex-1 space-y-2">
        <BlockEditorInner block={block} onChange={onChange} />
      </div>
      <button
        type="button"
        onClick={() => onRemove(block.id)}
        className="h-6 w-6 self-start rounded-full border border-red-900/60 text-[10px] text-red-300 opacity-0 transition group-hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

function BlockEditorInner({
  block,
  onChange
}: {
  block: Block;
  onChange: (id: string, data: any, type?: Block["type"]) => void;
}) {
  if (block.type === "heading") {
    return (
      <div className="space-y-2">
        <select
          className="h-8 rounded border border-borderSubtle/70 bg-black/60 px-2 text-xs focus:border-primary/50 outline-none"
          value={block.data.level}
          onChange={(e) =>
            onChange(block.id, { level: Number(e.target.value) as 1 | 2 | 3 })
          }
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
        </select>
        <LocalTextInput
          className="w-full rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 text-sm font-medium focus:border-primary/50 outline-none transition-colors"
          value={block.data.text}
          onBlur={(val) => onChange(block.id, { text: val })}
        />
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <LocalTextArea
        className="min-h-[80px] w-full rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 text-sm focus:border-primary/50 outline-none transition-colors"
        value={block.data.text}
        onBlur={(val) => onChange(block.id, { text: val })}
      />
    );
  }

  if (block.type === "image") {
    return (
      <div className="space-y-2 text-xs">
        <LocalTextInput
          placeholder="URL da imagem"
          className="w-full rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 focus:border-primary/50 outline-none transition-colors"
          value={block.data.url}
          onBlur={(val) => onChange(block.id, { url: val })}
        />
        <LocalTextInput
          placeholder="Legenda (opcional)"
          className="w-full rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 focus:border-primary/50 outline-none transition-colors"
          value={block.data.caption || ""}
          onBlur={(val) => onChange(block.id, { caption: val })}
        />
      </div>
    );
  }

  if (block.type === "link") {
    return (
      <div className="grid grid-cols-[2fr_3fr] gap-2 text-xs">
        <LocalTextInput
          placeholder="Texto do CTA"
          className="rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 focus:border-primary/50 outline-none transition-colors"
          value={block.data.label}
          onBlur={(val) => onChange(block.id, { label: val })}
        />
        <LocalTextInput
          placeholder="URL"
          className="rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 focus:border-primary/50 outline-none transition-colors"
          value={block.data.href}
          onBlur={(val) => onChange(block.id, { href: val })}
        />
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <div className="space-y-2 text-xs">
        <LocalTextArea
          placeholder="Texto da citação"
          className="min-h-[80px] w-full rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 focus:border-primary/50 outline-none transition-colors"
          value={block.data.text}
          onBlur={(val) => onChange(block.id, { text: val })}
        />
        <LocalTextInput
          placeholder="Autor (opcional)"
          className="w-full rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 focus:border-primary/50 outline-none transition-colors"
          value={block.data.attribution || ""}
          onBlur={(val) => onChange(block.id, { attribution: val })}
        />
      </div>
    );
  }

  if (block.type === "divider") {
    return (
      <div className="py-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        Divisor
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <div className="space-y-2 text-xs">
        <select
          className="h-8 rounded border border-borderSubtle/70 bg-black/60 px-2 focus:border-primary/50 outline-none"
          value={block.data.style}
          onChange={(e) =>
            onChange(block.id, { style: e.target.value as "bullet" | "numbered" })
          }
        >
          <option value="bullet">Lista com bullets</option>
          <option value="numbered">Lista numerada</option>
        </select>
        <div className="space-y-1">
          {block.data.items.map((item, idx) => (
            <LocalTextInput
              key={idx}
              className="w-full rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 focus:border-primary/50 outline-none transition-colors"
              value={item}
              onBlur={(val) => {
                const items = [...block.data.items];
                items[idx] = val;
                onChange(block.id, { items });
              }}
            />
          ))}
          <button
            type="button"
            className="text-[10px] text-primary font-mono mt-1 hover:underline"
            onClick={() =>
              onChange(block.id, { items: [...block.data.items, "Novo item"] })
            }
          >
            + ADD_ITEM
          </button>
        </div>
      </div>
    );
  }

  if (block.type === "callout") {
    return (
      <div className="space-y-2 text-xs">
        <select
          className="h-8 rounded border border-borderSubtle/70 bg-black/60 px-2 focus:border-primary/50 outline-none"
          value={block.data.tone}
          onChange={(e) =>
            onChange(block.id, {
              tone: e.target.value as "info" | "alert" | "tip"
            })
          }
        >
          <option value="tip">Dica</option>
          <option value="info">Info</option>
          <option value="alert">Alerta</option>
        </select>
        <LocalTextArea
          className="min-h-[60px] w-full rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 focus:border-primary/50 outline-none transition-colors"
          value={block.data.text}
          onBlur={(val) => onChange(block.id, { text: val })}
        />
      </div>
    );
  }

  if (block.type === "embed") {
    return (
      <div className="grid grid-cols-[2fr_3fr] gap-2 text-xs">
        <LocalTextInput
          placeholder="Título (opcional)"
          className="rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 focus:border-primary/50 outline-none transition-colors"
          value={block.data.title || ""}
          onBlur={(val) => onChange(block.id, { title: val })}
        />
        <LocalTextInput
          placeholder="URL do embed"
          className="rounded border border-borderSubtle/70 bg-black/60 px-3 py-2 focus:border-primary/50 outline-none transition-colors"
          value={block.data.url}
          onBlur={(val) => onChange(block.id, { url: val })}
        />
      </div>
    );
  }

  if (block.type === "wrong_right") {
    return (
      <WrongRightEditor
        block={block}
        onChange={(data) => onChange(block.id, data)}
      />
    );
  }

  return null;
}

function WrongRightEditor({
  block,
  onChange
}: {
  block: Extract<Block, { type: "wrong_right" }>;
  onChange: (data: any) => void;
}) {
  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Bloco especial · Errado → Certo
          </p>
          <input
            placeholder="Título do bloco (opcional)"
            className="mt-1 w-full rounded border border-borderSubtle/70 bg-black/60 px-2 py-1"
            value={block.data.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
        <button
          type="button"
          className="rounded-full border border-accent/60 px-3 py-1 text-[11px] text-accent"
          onClick={() =>
            onChange({
              pairs: [
                ...block.data.pairs,
                {
                  wrong: "",
                  right: "",
                  category: "gramatica",
                  level: "iniciante",
                  explanation: ""
                } as WrongRightPair
              ]
            })
          }
        >
          + Par
        </button>
      </div>
      <div className="space-y-3">
        {block.data.pairs.map((pair, idx) => (
          <div
            key={idx}
            className="space-y-2 rounded-xl border border-borderSubtle/80 bg-zinc-950/60 p-3"
          >
            <div className="grid gap-2 md:grid-cols-2">
              <textarea
                placeholder="Texto errado"
                className="min-h-[60px] w-full rounded border border-red-900/60 bg-red-950/40 px-2 py-1 text-xs"
                value={pair.wrong}
                onChange={(e) => {
                  const pairs = [...block.data.pairs];
                  pairs[idx] = { ...pair, wrong: e.target.value };
                  onChange({ pairs });
                }}
              />
              <textarea
                placeholder="Texto certo"
                className="min-h-[60px] w-full rounded border border-emerald-900/60 bg-emerald-950/40 px-2 py-1 text-xs"
                value={pair.right}
                onChange={(e) => {
                  const pairs = [...block.data.pairs];
                  pairs[idx] = { ...pair, right: e.target.value };
                  onChange({ pairs });
                }}
              />
            </div>
            <div className="grid gap-2 md:grid-cols-[2fr_2fr_3fr]">
              <select
                className="h-8 rounded border border-borderSubtle/70 bg-black/60 px-2"
                value={pair.category}
                onChange={(e) => {
                  const pairs = [...block.data.pairs];
                  pairs[idx] = {
                    ...pair,
                    category: e.target.value as WrongRightPair["category"]
                  };
                  onChange({ pairs });
                }}
              >
                <option value="gramatica">Gramática</option>
                <option value="postura">Postura</option>
                <option value="mensagem">Mensagem</option>
                <option value="atitude">Atitude</option>
              </select>
              <select
                className="h-8 rounded border border-borderSubtle/70 bg-black/60 px-2"
                value={pair.level}
                onChange={(e) => {
                  const pairs = [...block.data.pairs];
                  pairs[idx] = {
                    ...pair,
                    level: e.target.value as WrongRightPair["level"]
                  };
                  onChange({ pairs });
                }}
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
              <input
                placeholder="Explicação (opcional)"
                className="w-full rounded border border-borderSubtle/70 bg-black/60 px-2 py-1"
                value={pair.explanation || ""}
                onChange={(e) => {
                  const pairs = [...block.data.pairs];
                  pairs[idx] = { ...pair, explanation: e.target.value };
                  onChange({ pairs });
                }}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-[11px] text-red-400"
                onClick={() => {
                  const pairs = block.data.pairs.filter((_, i) => i !== idx);
                  onChange({ pairs });
                }}
              >
                Remover par
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocalTextInput({
  value,
  onBlur,
  className,
  placeholder
}: {
  value: string;
  onBlur: (val: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value);
  return (
    <input
      value={local}
      placeholder={placeholder}
      className={className}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => onBlur(local)}
    />
  );
}

function LocalTextArea({
  value,
  onBlur,
  className,
  placeholder
}: {
  value: string;
  onBlur: (val: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value);
  return (
    <textarea
      value={local}
      placeholder={placeholder}
      className={className}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => onBlur(local)}
    />
  );
}

function BlockToolbarButton(props: {
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`rounded-full border px-4 py-1.5 transition-all text-[10px] font-mono tracking-tight ${props.accent
        ? "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 shadow-[0_0_15px_rgba(43,255,136,0.05)]"
        : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white"
        }`}
    >
      {props.label}
    </button>
  );
}

