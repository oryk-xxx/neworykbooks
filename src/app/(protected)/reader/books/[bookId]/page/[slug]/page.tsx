import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/editor/BlockRenderer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { PageContent } from "lib/blocks";
import { AntiLeakGuard } from "@/components/AntiLeakGuard";

export default async function ReaderPage(props: {
  params: { bookId: string; slug: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: page } = await supabase
    .from("pages")
    .select("id, book_id, slug, order_index, content, estimated_read_time_minutes")
    .eq("book_id", props.params.bookId)
    .eq("slug", props.params.slug)
    .maybeSingle();

  if (!page) {
    notFound();
  }

  const { data: progress } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("page_id", page.id)
    .maybeSingle();

  const unlocked = progress?.unlocked === true || page.order_index === 1;

  const content = page.content as PageContent;
  const watermark = `${session.user.id.slice(0, 8)} · ${new Date()
    .toISOString()
    .slice(0, 19)} · ØRYK`;

  return (
    <div className="space-y-6">
      <AntiLeakGuard watermark={watermark} />
      <BlockRenderer blocks={content.blocks} watermark="" />
      <SummaryForm
        bookId={String(page.book_id)}
        pageId={String(page.id)}
        nextSlug=""
        unlocked={unlocked}
      />
    </div>
  );
}

function SummaryForm(props: {
  bookId: string;
  pageId: string;
  nextSlug: string;
  unlocked: boolean;
}) {
  const disabled = !props.unlocked;
  return (
    <form action="/api/progress/submit" method="post" className="space-y-3">
      <input type="hidden" name="book_id" value={props.bookId} />
      <input type="hidden" name="page_id" value={props.pageId} />
      <div className="space-y-1">
        <label className="text-xs text-zinc-300">Resumo da página</label>
        <textarea
          name="summary"
          required
          minLength={80}
          className="min-h-[120px] w-full rounded-lg border border-borderSubtle/80 bg-black/60 p-3 text-sm"
          placeholder="Escreva seu entendimento com suas palavras..."
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-xs font-medium text-black"
      >
        Enviar resumo
      </button>
      {!disabled ? null : (
        <p className="text-xs text-zinc-400">
          Você precisa desbloquear esta página para enviar o resumo.
        </p>
      )}
    </form>
  );
}
