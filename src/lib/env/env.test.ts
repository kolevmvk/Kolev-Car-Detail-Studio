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

  it("uses the production default when NEXT_PUBLIC_SITE_URL is absent", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { NEXT_PUBLIC_SITE_URL: _siteUrl, ...withoutSiteUrl } = validPublic;
    expect(publicEnvSchema.parse(withoutSiteUrl).NEXT_PUBLIC_SITE_URL).toBe(
      "https://kolev-car-detail-studio.vercel.app",
    );
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
