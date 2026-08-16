import { describe, expect, it } from "vitest";
import { publicEnvSchema, serverEnvSchema } from "./schema";

const validPublic = {
  NEXT_PUBLIC_SUPABASE_URL: "https://dzsotxqkpwszlaethzdt.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
};

describe("publicEnvSchema", () => {
  it("accepts valid public variables", () => {
    expect(publicEnvSchema.parse(validPublic).NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("rejects a missing publishable key", () => {
    const result = publicEnvSchema.safeParse({
      ...validPublic,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("serverEnvSchema", () => {
  it("requires a service-role key", () => {
    const result = serverEnvSchema.safeParse({
      ...validPublic,
      NODE_ENV: "test",
      SUPABASE_SERVICE_ROLE_KEY: "",
    });
    expect(result.success).toBe(false);
  });

  it("does not treat the service-role key as a public field", () => {
    expect("SUPABASE_SERVICE_ROLE_KEY" in publicEnvSchema.shape).toBe(false);
  });
});
