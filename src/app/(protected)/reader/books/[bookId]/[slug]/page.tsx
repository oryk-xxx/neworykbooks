import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/editor/BlockRenderer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { PageContent } from "@/lib/blocks";
import { AntiLeakGuard } from "@/components/AntiLeakGuard";

export default async function ReaderPage(props: {
  params: { bookId: string; slug: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

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
    .eq("user_id", user.id)
    .eq("page_id", page.id)
    .maybeSingle();

  const unlocked = progress?.unlocked === true || page.order_index === 1;

  const content = page.content as PageContent;
  const watermark = `${user.id.slice(0, 8)} · ${new Date()
    .toISOString()
    .slice(0, 19)} · ØRYK`;

  return (
    <div className="max-w-2xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <AntiLeakGuard watermark={watermark} />

      <article className="prose prose-invert prose-oryk max-w-none">
        <header className="mb-12 border-b border-white/[0.05] pb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent">Página {String(page.order_index).padStart(2, '0')}</span>
            <span className="h-px w-8 bg-white/10" />
            <span className="text-[10px] uppercase tracking-oryk text-text-meta">{page.estimated_read_time_minutes || 5} MIN LEITURA</span>
          </div>
          <h1 className="text-4xl font-medium tracking-oryk-wide text-white uppercase leading-tight">
            {page.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </h1>
        </header>

        <div className="text-text-secondary leading-relaxed font-light tracking-wide text-lg selection:bg-accent/30">
          <BlockRenderer blocks={content.blocks} watermark="" />
        </div>
      </article>

      <div className="pt-16 border-t border-white/[0.05]">
        <SummaryForm
          bookId={String(page.book_id)}
          pageId={String(page.id)}
          nextSlug=""
          unlocked={unlocked}
        />
      </div>
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
    <div className="oryk-surface p-10 space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl font-medium tracking-oryk text-white uppercase">Sincronização de Conhecimento</h3>
        <p className="text-xs text-text-secondary tracking-oryk leading-relaxed">
          Para prosseguir ao próximo volume, sintetize seu entendimento. <br />
          Mínimo de 80 caracteres.
        </p>
      </div>

      <form action="/api/progress/submit" method="post" className="space-y-6">
        <input type="hidden" name="book_id" value={props.bookId} />
        <input type="hidden" name="page_id" value={props.pageId} />

        <div className="relative group">
          <textarea
            name="summary"
            required
            disabled={disabled}
            minLength={80}
            className="oryk-input min-h-[160px] py-4 text-sm leading-relaxed resize-none transition-all duration-300 focus:ring-1 focus:ring-accent/20"
            placeholder="Descreva as principais lições desta seção..."
          />
          <div className="absolute bottom-3 right-3 text-[9px] uppercase tracking-oryk text-text-meta pointer-events-none group-focus-within:text-accent transition-colors">
            SYNT_MODE_ACTIVE
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button
            type="submit"
            disabled={disabled}
            className={`oryk-button-accent py-4 px-10 text-[10px] uppercase tracking-oryk w-full sm:w-auto ${disabled ? "opacity-20 cursor-not-allowed grayscale" : "shadow-[0_10px_30px_rgba(43,255,136,0.1)]"
              }`}
          >
            Validar Conhecimento
          </button>

          {disabled && (
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <p className="text-[10px] text-text-meta uppercase tracking-oryk">
                Aguardando desbloqueio de acesso
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
