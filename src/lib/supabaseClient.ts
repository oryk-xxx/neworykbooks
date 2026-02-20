import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function createSupabaseBrowserClient() {
  return createBrowserSupabaseClient<any>();
}

export function createSupabaseClientComponent() {
  return createClientComponentClient<any>();
}
