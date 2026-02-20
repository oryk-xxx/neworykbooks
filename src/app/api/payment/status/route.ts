import { NextResponse } from "next/server";
import { env } from "../../../../lib/env";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "missing id" }, { status: 400 });
  }

  const res = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    headers: {
      Authorization: `Bearer ${env.mercadoPagoAccessToken}`
    },
    cache: "no-store"
  });

  if (!res.ok) {
    return NextResponse.json({ error: "mp error" }, { status: 500 });
  }
  const json = await res.json();
  return NextResponse.json({ status: json.status });
}

