import type { Block, WrongRightBlock } from "../../lib/blocks";

interface Props {
  blocks: Block[];
  watermark?: string;
}

export function BlockRenderer({ blocks, watermark }: Props) {
  return (
    <div className="relative space-y-6 text-sm leading-relaxed">
      {watermark ? (
        <div className="blurred-watermark select-none">{watermark}</div>
      ) : null}
      <article className="relative space-y-4 no-select">
        {blocks.map((block) => {
          switch (block.type) {
            case "heading": {
              const Tag = (["h1", "h2", "h3"] as const)[block.data.level - 1];
              const size =
                block.data.level === 1
                  ? "text-2xl"
                  : block.data.level === 2
                  ? "text-xl"
                  : "text-lg";
              return (
                <Tag key={block.id} className={`${size} font-semibold`}>
                  {block.data.text}
                </Tag>
              );
            }
            case "paragraph":
              return (
                <p key={block.id} className="text-zinc-200">
                  {block.data.text}
                </p>
              );
            case "image":
              return (
                <figure
                  key={block.id}
                  className="space-y-2 rounded-xl border border-borderSubtle/80 bg-black/40 p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.data.url}
                    alt={block.data.caption || ""}
                    className="max-h-72 w-full rounded-lg object-cover"
                    draggable={false}
                  />
                  {block.data.caption ? (
                    <figcaption className="text-xs text-zinc-400">
                      {block.data.caption}
                    </figcaption>
                  ) : null}
                </figure>
              );
            case "link":
              return (
                <a
                  key={block.id}
                  href={block.data.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accentMuted/60 px-3 py-1 text-xs text-accent hover:bg-accent/10"
                >
                  <span>{block.data.label}</span>
                </a>
              );
            case "quote":
              return (
                <blockquote
                  key={block.id}
                  className="border-l-2 border-accent/70 bg-zinc-900/60 p-3 text-sm text-zinc-200"
                >
                  <p className="italic">“{block.data.text}”</p>
                  {block.data.attribution ? (
                    <footer className="mt-2 text-xs text-zinc-400">
                      — {block.data.attribution}
                    </footer>
                  ) : null}
                </blockquote>
              );
            case "divider":
              return (
                <hr
                  key={block.id}
                  className="border-t border-dashed border-borderSubtle/70"
                />
              );
            case "list":
              return block.data.style === "bullet" ? (
                <ul
                  key={block.id}
                  className="list-disc space-y-1 pl-5 text-zinc-200"
                >
                  {block.data.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <ol
                  key={block.id}
                  className="list-decimal space-y-1 pl-5 text-zinc-200"
                >
                  {block.data.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              );
            case "callout": {
              const toneStyles =
                block.data.tone === "alert"
                  ? "border-red-500/60 bg-red-950/40 text-red-50"
                  : block.data.tone === "tip"
                  ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-50"
                  : "border-sky-500/60 bg-sky-950/40 text-sky-50";
              const label =
                block.data.tone === "alert"
                  ? "Alerta"
                  : block.data.tone === "tip"
                  ? "Dica"
                  : "Info";
              return (
                <div
                  key={block.id}
                  className={`rounded-xl border px-4 py-3 text-xs ${toneStyles}`}
                >
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide">
                    {label}
                  </p>
                  <p>{block.data.text}</p>
                </div>
              );
            }
            case "embed":
              return (
                <div
                  key={block.id}
                  className="rounded-xl border border-borderSubtle/80 bg-black/40 p-3 text-xs text-zinc-200"
                >
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-zinc-500">
                    Embed
                  </p>
                  <a
                    href={block.data.url}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-accent underline-offset-2 hover:underline"
                  >
                    {block.data.title || block.data.url}
                  </a>
                </div>
              );
            case "wrong_right":
              return (
                <WrongRightView key={block.id} block={block} />
              );
            default:
              return null;
          }
        })}
      </article>
    </div>
  );
}

function WrongRightView({ block }: { block: WrongRightBlock }) {
  return (
    <section className="space-y-3 rounded-2xl border border-borderSubtle/80 bg-zinc-950/70 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          Bloco especial · Errado → Certo
        </p>
        {block.data.title ? (
          <p className="text-xs text-zinc-400">{block.data.title}</p>
        ) : null}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {block.data.pairs.map((pair, idx) => (
          <div
            key={idx}
            className="space-y-2 rounded-xl border border-borderSubtle/80 bg-black/40 p-3"
          >
            <div className="rounded-lg border border-red-900/60 bg-red-950/40 p-3 text-xs">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-red-400">
                Errado
              </p>
              <p className="text-zinc-100">{pair.wrong}</p>
            </div>
            <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/40 p-3 text-xs">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                Certo
              </p>
              <p className="text-zinc-100">{pair.right}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-zinc-400">
              <span>Categoria: {pair.category}</span>
              <span>Nível: {pair.level}</span>
            </div>
            {pair.explanation ? (
              <p className="text-[11px] text-zinc-400">{pair.explanation}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

