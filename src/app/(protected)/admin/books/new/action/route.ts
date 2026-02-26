import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return NextResponse.redirect(new URL("/login", request.url));

  const form = await request.formData();
  const title = String(form.get("title") || "");
  const summary = String(form.get("summary") || "");
  const tagsStr = String(form.get("tags") || "");
  const tags = tagsStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const { data, error } = await supabase
    .from("books")
    .insert({
      title,
      summary,
      tags,
      status: "draft"
    })
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(new URL("/admin/books?error=create_failed", request.url));
  }

  return NextResponse.redirect(
    new URL(`/admin/books/${data.id}`, request.url)
  );
}
