import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SocialDock } from "./SocialDock";

describe("SocialDock", () => {
  it("renders six networks and only live URLs become links", () => {
    const html = renderToStaticMarkup(
      <SocialDock
        variant="board"
        links={{
          instagram: "https://instagram.com/kolev",
          facebook: null,
          tiktok: null,
          whatsapp: "https://wa.me/3816",
          viber: null,
          telegram: null,
        }}
      />,
    );

    expect(html.match(/social-dock__item/g)?.length).toBe(6);
    expect(html).toContain("Instagram");
    expect(html).toContain("Facebook");
    expect(html).toContain("TikTok");
    expect(html).toContain("WhatsApp");
    expect(html).toContain("Viber");
    expect(html).toContain("Telegram");
    expect(html).toContain('href="https://instagram.com/kolev"');
    expect(html).toContain('href="https://wa.me/3816"');
    expect(html).not.toContain("facebook.com");
    expect(html).toContain('data-live="false"');
    expect(html).toContain('data-live="true"');
  });
});
