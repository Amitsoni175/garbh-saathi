import { expect, test, type Page } from '@playwright/test';

async function completions(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        const req = indexedDB.open('garbh-saathi');
        req.onsuccess = () => {
          const tx = req.result.transaction('completions');
          const count = tx.objectStore('completions').count();
          count.onsuccess = () => resolve(count.result);
        };
      }),
  );
}

test('onboarding → correct week → story → game → garden grows → data survives reload', async ({
  page,
}) => {
  // Pin "today" with the debug clock so the expected week is stable.
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('gs.debug.dateOverride', '2026-11-15'));
  await page.reload();

  // 1. Onboarding with LMP
  await page.getByRole('button', { name: /English/ }).click();
  await page.getByRole('button', { name: /Let’s begin/ }).click();
  await page.locator('input[type=date]').fill('2026-06-01');
  await expect(page.getByText(/Week 23 · Day 6/)).toBeVisible();
  await page.getByRole('button', { name: /Next/ }).click();
  await page.getByLabel('Your name').fill('Sukanya');
  await page.getByRole('button', { name: /Start my journey/ }).click();

  // 2. The Thought of the Day opens by itself on the first visit of the day
  await expect(page.getByText(/Recite it softly to baby/i)).toBeVisible();
  await page.getByRole('button', { name: /Begin my day/ }).click();

  // Home shows the correct week
  await expect(page.getByText('Week 23 · Day 6')).toBeVisible();
  await expect(page.getByText(/0 flowers so far/)).toBeVisible();

  // 3. Open today's story (Abhimanyu, story #1) and finish it
  await page.getByRole('button', { name: /^Story: Abhimanyu/ }).click();
  await expect(page.getByRole('heading', { name: /Abhimanyu/ })).toBeVisible();
  // Cards, lesson, quick check, reflection: tap Next until the story can be finished.
  const finishBtn = page.getByRole('button', { name: /Finish story/ });
  for (let i = 0; i < 12 && !(await finishBtn.isVisible()); i++)
    await page.getByRole('button', { name: /^Next/ }).click();
  await page.getByRole('button', { name: /Finish story/ }).click();
  await expect(page.getByText(/1 flowers so far/)).toBeVisible();

  // 4. Finish a game (Baby Size Guess: always one tap + Done)
  await page.goto('/#/play/babySize');
  await page
    .locator('main, body')
    .getByRole('button')
    .filter({ hasText: /🌽|🍠|🥕|🍌|🥒|🥦|🥬|🍆|🥥|🍍|🍊|🍈|🎃|🍉|🥭|🍐|🍎|🧅|🫑/ })
    .first()
    .click();
  await page.getByRole('button', { name: /^Done/ }).click();
  await expect(page.getByRole('heading', { name: /Shabaash/ })).toBeVisible();

  // 5. The garden count went up
  expect(await completions(page)).toBe(2);
  await page.goto('/#/');
  await expect(page.getByText(/2 flowers so far/)).toBeVisible();

  // 6. Reload: everything is still there
  await page.reload();
  await expect(page.getByText('Week 23 · Day 6')).toBeVisible();
  await expect(page.getByText(/2 flowers so far/)).toBeVisible();
  expect(await completions(page)).toBe(2);
});
