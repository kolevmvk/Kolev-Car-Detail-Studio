import { publicEnvSchema, type PublicEnv } from "./schema";

export type { PublicEnv };

export function readPublicEnv(source: Record<string, string | undefined> = process.env): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: source.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: source.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SITE_URL: source.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_INSTAGRAM_URL: source.NEXT_PUBLIC_INSTAGRAM_URL,
    NEXT_PUBLIC_FACEBOOK_URL: source.NEXT_PUBLIC_FACEBOOK_URL,
    NEXT_PUBLIC_TIKTOK_URL: source.NEXT_PUBLIC_TIKTOK_URL,
  });
}
