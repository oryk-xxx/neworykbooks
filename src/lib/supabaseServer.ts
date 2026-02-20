import { cookies } from "next/headers";
import {
  createRouteHandlerClient,
  createServerComponentClient
} from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

export function createSupabaseRouteHandlerClient() {
  return createRouteHandlerClient<any>({
    cookies
  });
}

export function createSupabaseServerComponentClient() {
  return createServerComponentClient<any>({ cookies });
}

export function createSupabaseServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY ou URL não configurados.");
  }

  return createClient<any>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
