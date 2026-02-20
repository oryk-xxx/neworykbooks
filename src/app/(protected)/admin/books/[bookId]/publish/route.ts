import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "lib/supabaseServer";

export async function POST(request: Request, props: { params: { bookId: string } }) {
  const supabase = createSupabaseRouteHandlerClient();
  const { data: book } = await supabase
    .from("books")
    .select("status")
    .eq("id", props.params.bookId)
    .maybeSingle();

  const nextStatus = book?.status === "published" ? "draft" : "published";

  await supabase.from("books").update({ status: nextStatus }).eq("id", props.params.bookId);
  return NextResponse.redirect(new URL(`/admin/books/${props.params.bookId}`, request.url));
}
