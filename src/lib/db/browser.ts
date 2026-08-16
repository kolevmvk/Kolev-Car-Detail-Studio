import { createBrowserClient } from "@supabase/ssr";
import { readPublicEnv } from "@/lib/env/public";

export function createBrowserSupabaseClient() {
  const env = readPublicEnv();

  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
