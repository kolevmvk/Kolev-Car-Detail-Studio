import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("env schema", () => {
  it("rejects missing required variables", () => {
    const schema = z.object({ NEXT_PUBLIC_SUPABASE_URL: z.string().url() });
    const result = schema.safeParse({ NEXT_PUBLIC_SUPABASE_URL: "" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid URL", () => {
    const schema = z.object({ NEXT_PUBLIC_SUPABASE_URL: z.string().url() });
    const result = schema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    });
    expect(result.success).toBe(true);
  });
});
