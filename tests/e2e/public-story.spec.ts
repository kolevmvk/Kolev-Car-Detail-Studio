import { expect, test } from "@playwright/test";

test("homepage tells the NEKAD·SADA·PONOVO story without template chrome", async ({
  page,
}) => {
  await page.goto("/");

  // SR heading identifies the page
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Auto detajling u Negotinu"
  );

  // Scene 01 — Memory
  await expect(page.getByText("Sećaš se?")).toBeVisible();

  // Scene 02 — Time
  await expect(page.getByText("Nije se promenio")).toBeVisible();
  await expect(page.getByText("Samo si prestao da primećuješ.")).toBeVisible();

  // Scene 03 — Recognition
  await expect(page.getByText("Nije ostario.")).toBeVisible();

  // Scene 07 — Return
  await expect(page.getByText("Ne vraćamo vreme.")).toBeVisible();

  // Scene 08 — Action (CTA only at end of story)
  await expect(
    page.getByRole("link", { name: "Pogledaj prvi slobodan termin" })
  ).toBeVisible();

  // Anti-template: no generic marketing patterns
  await expect(page.getByText("testimonial", { exact: false })).toHaveCount(0);
  await expect(page.getByText("sponzor", { exact: false })).toHaveCount(0);

  // No sticky CTA haunting the whole page — only one booking link (at end)
  await expect(
    page.getByRole("link", { name: "Pogledaj prvi slobodan termin" })
  ).toHaveCount(1);
});

test("booking page does not invent slots", async ({ page }) => {
  await page.goto("/booking");

  await expect(page.getByRole("heading", { name: /Kapacitet/ })).toBeVisible();
  await expect(page.getByText("lista ostaje prazna namerno")).toBeVisible();
  await expect(page.getByText(/\d{1,2}:\d{2}/)).toHaveCount(0);
});

test("reduced motion exposes comparison frames statically", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByText("Rad", { exact: true })).toBeVisible();
  await expect(page.getByText("Rezultat", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Pritisni i drži/ })
  ).toHaveCount(0);
});
