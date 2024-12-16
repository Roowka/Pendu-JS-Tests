// @ts-check
const { test, expect } = require("@playwright/test");

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3030");

  await expect(page).toHaveTitle(/The Hangman game/);
});

test("userWord contains only # at the start", async ({ page }) => {
  await page.goto("http://localhost:3030");

  const userWord =
    (await (await page.locator("#userWord").innerText()).match(/#.*#/g)?.[0]) ||
    "";

  expect(userWord).toMatch(/^[#]+$/);
});

test("try a letter", async ({ page }) => {
  await page.goto("http://localhost:3030");

  await page.locator("#letterInput").fill("a");

  await page.locator("#submitGuess").click();

  const userWordLocator = page.locator("#userWord");
  const nbTriesLocator = page.locator("#nbLeftTries");

  const wrapAssertion = async (assertion) => {
    try {
      await assertion();
      return true; // Résout si l'assertion réussit
    } catch {
      return false; // Résout avec `false` si l'assertion échoue
    }
  };

  const result = await Promise.race([
    wrapAssertion(() => expect(userWordLocator).toContainText("a")),
    wrapAssertion(() =>
      expect(nbTriesLocator).not.toContainText(
        "Nombre de tentatives restantes : 5"
      )
    ),
  ]);

  expect(result).toBe(true); // Vérifie qu'au moins une assertion a réussi
});

test("userWord contains letters when entering a good letter", async ({
  page,
}) => {
  await page.goto("http://localhost:3030");

  const goodLetters = ["a", "e", "i", "o", "u"];

  for (const letter of goodLetters) {
    await page.locator("#letterInput").fill(letter);
    await page.locator("#submitGuess").click();
  }

  const userWord = (await page.locator("#userWord").innerText()).split(": ")[1];

  expect(userWord).toMatch(/^(?![#]+$).*$/);
});
