import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PromotionBanner, type PublicPromotion } from "./PromotionBanner";

const promotion: PublicPromotion = {
  id: "promo-test",
  template: "service_focus",
  eyebrow: "Akcija ove nedelje",
  headline: "Farovi ponovo hvataju svetlo.",
  body: "Unapred dizajniran segment sa cenom iz usluge.",
  ctaLabel: "Pogledaj termine",
  ctaHref: "/booking",
  service: {
    name: "Obnova farova",
    priceMode: "from",
    priceAmountMinor: 499_900,
    currency: "RSD",
  },
};

describe("PromotionBanner", () => {
  it("renders the linked service price from canonical service data", () => {
    const html = renderToStaticMarkup(
      <PromotionBanner promotion={promotion} />,
    );

    expect(html).toContain("Obnova farova");
    expect(html).toContain("od 4.999 RSD");
    expect(html).toContain('href="/booking"');
    expect(html).toContain("promotion--service_focus");
  });

  it("escapes owner-authored copy instead of treating it as HTML", () => {
    const html = renderToStaticMarkup(
      <PromotionBanner
        promotion={{
          ...promotion,
          headline: "<script>alert('x')</script>",
        }}
      />,
    );

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
