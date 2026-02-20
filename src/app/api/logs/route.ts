import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "../../../lib/supabaseServer";

export async function POST(request: Request) {
  const supabase = createSupabaseRouteHandlerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  const ip =
    (request.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || "";
  const ua = request.headers.get("user-agent") || "";
  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "");
  if (!action) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await supabase.from("logs").insert({
    user_id: session?.user.id || null,
    action,
    ip,
    user_agent: ua
  });
  return NextResponse.json({ ok: true });
}

