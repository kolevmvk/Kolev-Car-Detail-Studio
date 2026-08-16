import { expect, test } from "@playwright/test";

test("homepage tells the story without template chrome", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Auto detajling u Negotinu"
  );
  await expect(page.getByText("Sećaš se kako je")).toBeVisible();
  await expect(page.getByText("Samo si prestao da primećuješ.")).toBeVisible();
  await expect(page.getByText("Drugi utisak.")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Pogledaj prvi slobodan termin" }).first()
  ).toBeVisible();

  await expect(page.getByText("testimonial", { exact: false })).toHaveCount(0);
  await expect(page.getByText("sponzor", { exact: false })).toHaveCount(0);
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
