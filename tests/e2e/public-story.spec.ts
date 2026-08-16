import { expect, test } from "@playwright/test";

test("homepage tells the NEKAD·SADA·PONOVO story without template chrome", async ({
  page,
}) => {
  await page.goto("/");

  // SR heading identifies the page
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Auto detajling u Negotinu"
  );

  // S01 — Memory
  await expect(page.getByText("Sećaš se?")).toBeVisible();

  // S02 — Time
  await expect(page.getByText("Nije se promenio")).toBeVisible();
  await expect(page.getByText("Samo si prestao da primećuješ.")).toBeVisible();

  // S03 — Recognition (film pause)
  await expect(page.getByText("Nije ostario.")).toBeVisible();

  // S07 — Return
  await expect(page.getByText("Ne vraćamo vreme.")).toBeVisible();

  // S08 — Emotional proposition + single CTA (appears only at story's end)
  await expect(page.getByText("Možda mu ne treba")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Pogledaj prvi slobodan termin" })
  ).toHaveCount(1);

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

  await expect(page.getByText("Rad", { exact: true })).toBeVisible();
  await expect(page.getByText("Rezultat", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Pritisni i drži/ })
  ).toHaveCount(0);
});
