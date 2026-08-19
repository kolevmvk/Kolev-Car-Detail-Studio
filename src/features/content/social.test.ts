import { describe, expect, it } from "vitest";
import { isPublicPhone, toTelHref } from "./social";

describe("public telephone", () => {
  it("accepts a local or international number and builds a tel href", () => {
    expect(isPublicPhone("+381 64 123 4567")).toBe(true);
    expect(toTelHref("+381 64 123 4567")).toBe("tel:+381641234567");
    expect(toTelHref("064-123-4567")).toBe("tel:0641234567");
  });

  it("refuses empty or invented-looking placeholders", () => {
    expect(isPublicPhone("")).toBe(false);
    expect(toTelHref("")).toBe("");
    expect(toTelHref("n/a")).toBe("");
    expect(isPublicPhone("123")).toBe(false);
  });
});
