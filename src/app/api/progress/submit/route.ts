import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseRouteHandlerClient } from "lib/supabaseServer";
import type { PageContent } from "lib/blocks";
import { evaluateSummaryWithAI } from "lib/ai";

const bodySchema = z.object({
  book_id: z.string().uuid(),
  page_id: z.string().uuid(),
  summary: z.string().min(60)
});

export async function POST(request: Request) {
  const supabase = createSupabaseRouteHandlerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await request.formData();
  const payload = {
    book_id: String(form.get("book_id") || ""),
    page_id: String(form.get("page_id") || ""),
    summary: String(form.get("summary") || "")
  };

  const parse = bodySchema.safeParse(payload);
  if (!parse.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { data: page } = await supabase
    .from("pages")
    .select("id, book_id, order_index, content")
    .eq("id", payload.page_id)
    .eq("book_id", payload.book_id)
    .maybeSingle();
  if (!page) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { data: prev } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("page_id", payload.page_id)
    .maybeSingle();

  const now = Date.now();
  const lastAt = prev?.last_attempt_at ? new Date(prev.last_attempt_at).getTime() : 0;
  const cooldownMs = 30000;
  if (now - lastAt < cooldownMs) {
    return NextResponse.json({
      approved: false,
      reason: "cooldown",
      retry_after_ms: cooldownMs - (now - lastAt)
    });
  }

  const content = page.content as PageContent;

  let score: number;
  let approved: boolean;
  let explanation: string | undefined;

  const aiResult = await evaluateSummaryWithAI(payload.summary, content);

  if (aiResult) {
    score = aiResult.score;
    approved = aiResult.approved;
    explanation = aiResult.explanation;
  } else {
    score = evaluateSummary(payload.summary, content);
    approved = score >= 0.55;
  }

  await supabase
    .from("progress")
    .upsert({
      user_id: session.user.id,
      book_id: payload.book_id,
      page_id: payload.page_id,
      unlocked: approved,
      attempts: (prev?.attempts || 0) + 1,
      score,
      last_attempt_at: new Date().toISOString()
    } as any);

  return NextResponse.json({
    approved,
    score,
    explanation
  });
}

function evaluateSummary(summary: string, content: PageContent) {
  const textParts: string[] = [];
  for (const b of content.blocks) {
    if (b.type === "paragraph" || b.type === "heading" || b.type === "quote") {
      const t =
        b.type === "heading"
          ? (b.data as any).text
          : b.type === "quote"
          ? (b.data as any).text
          : (b.data as any).text;
      if (t) textParts.push(t.toLowerCase());
    }
    if (b.type === "list") {
      textParts.push(...(b.data as any).items.map((i: string) => i.toLowerCase()));
    }
    if (b.type === "callout") {
      textParts.push((b.data as any).text.toLowerCase());
    }
    if (b.type === "wrong_right") {
      for (const p of (b.data as any).pairs) {
        textParts.push(String(p.right).toLowerCase());
        textParts.push(String(p.explanation || "").toLowerCase());
      }
    }
  }
  const pageText = textParts.join(" ");
  const summaryTokens = tokenize(summary.toLowerCase());
  const pageTokens = new Set(tokenize(pageText));
  let intersect = 0;
  for (const tok of summaryTokens) if (pageTokens.has(tok)) intersect++;
  const ratio = summaryTokens.length > 0 ? intersect / summaryTokens.length : 0;
  return Math.min(1, Math.max(0, ratio));
}

function tokenize(text: string) {
  return text.split(/[^a-zA-ZÀ-ÿ0-9]+/).filter((t) => t.length >= 3);
}
