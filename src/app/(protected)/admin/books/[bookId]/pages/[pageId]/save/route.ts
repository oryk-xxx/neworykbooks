import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const schema = z.object({
  slug: z.string().min(2),
  order_index: z.coerce.number().min(1),
  content_json: z.string().min(2)
});

export async function POST(request: Request, props: { params: { bookId: string; pageId: string } }) {
  const supabase = createSupabaseServerClient();
  const form = await request.formData();
  const parse = schema.safeParse({
    slug: String(form.get("slug") || ""),
    order_index: Number(form.get("order_index") || "1"),
    content_json: String(form.get("content_json") || "")
  });
  if (!parse.success) {
    return NextResponse.redirect(new URL(`/admin/books/${props.params.bookId}/pages/${props.params.pageId}?error=invalid`, request.url));
  }
  const payload = parse.data;
  const content = JSON.parse(payload.content_json);
  const { data, error } = await supabase
    .from("pages")
    .update({
      slug: payload.slug,
      order_index: payload.order_index,
      content
    })
    .eq("id", props.params.pageId)
    .select("*")
    .maybeSingle();
  if (!data || error) {
    return NextResponse.redirect(new URL(`/admin/books/${props.params.bookId}/pages/${props.params.pageId}?error=save_failed`, request.url));
  }
  await supabase.from("page_versions").insert({
    page_id: data.id,
    content
  });
  return NextResponse.redirect(new URL(`/admin/books/${props.params.bookId}/pages/${props.params.pageId}`, request.url));
}
