import { expect, test } from "@playwright/test";

test("homepage tells one car's life story without template chrome", async ({
  page,
}) => {
  await page.goto("/");

  // S01 — Memory
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Sećaš se kako je izgledao",
  );

  // S02 — Years in the life of one car
  await expect(
    page.getByText("Držala ga je malo duže nego što je morala."),
  ).toBeVisible();

  // S03 — Recognition under inspection light
  await expect(page.locator(".inspection__headline")).toContainText(
    "Nije starost.",
  );

  // S07 — Return keeps the owner and the same car in frame.
  await expect(page.locator(".age-removal__headline")).toContainText(
    "Skidamo godine",
  );

  // One persistent booking instrument replaces duplicate scene CTAs.
  await expect(page.getByText("Možda ti ne treba")).toBeVisible();
  await expect(page.locator(".site-chrome__cta")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Pogledaj prvi slobodan termin" })
  ).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Otvori mreže" })).toBeVisible();
  await expect(page.locator(".social-orb__item")).toHaveCount(6);
  await expect(page.locator(".craft-reel")).toBeVisible();
  await expect(page.getByRole("tab", { name: /ulaz/ })).toBeVisible();
  await expect(page.locator("#cenovnik-title")).toBeAttached();
  await expect(page.locator("#cenovnik .price-scene__list li").first()).toBeAttached();
  await expect(page.locator(".price-scene .social-dock--board")).toHaveCount(0);

  // Practical layer is reachable without replaying the story.
  await page.getByRole("button", { name: "Meni" }).click();
  await expect(page.getByRole("dialog", { name: "Praktična navigacija" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Cenovnik i usluge/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Slobodni termini/ }),
  ).toBeVisible();

  // Anti-template assertions
  await expect(page.getByText("testimonial", { exact: false })).toHaveCount(0);
  await expect(page.getByText("sponzor", { exact: false })).toHaveCount(0);
});

test("booking page does not invent slots", async ({ page }) => {
  await page.goto("/booking");

  // In CI without DB, either the service-selection UI or an error state is shown.
  // Both are acceptable — what is NOT acceptable is fabricated time slots.
  // The slot list (.bk-slots) must be empty on initial load.
  await expect(page.locator(".bk-slots")).toHaveCount(0);

  // No fabricated "HH:MM" patterns in the slot-time element
  await expect(page.locator(".bk-slot__time")).toHaveCount(0);
});

test("reduced motion exposes comparison frames statically", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(
    page.locator(".hold-static").getByText("Stanje", { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".hold-static").getByText("Rezultat", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Pritisni i drži/ })
  ).toHaveCount(0);
});
