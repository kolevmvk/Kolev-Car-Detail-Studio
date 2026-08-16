import { z } from "zod";

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  // Optional at build time: used for OG metadataBase only, not for DB client creation.
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .optional()
    .default("https://kolev-car-detail-studio.vercel.app"),
});

export const serverEnvSchema = publicEnvSchema.extend({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
