import "server-only";

import { createClient } from "@supabase/supabase-js";
import { readServerEnv } from "@/lib/env/server";
import type { Database } from "@/types/database";

/** Server-only. Never import from client components. */
export function createAdminSupabaseClient() {
  const env = readServerEnv();

  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
