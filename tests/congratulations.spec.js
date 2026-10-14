const { test, expect } = require('@playwright/test');

async function prepareForm(page, name) {
  await page.goto('/?debug=1');
  await expect(page.locator('#status-msg')).toHaveText('Debug mode: trolls disabled.');

  // The documented cheat fills the other fields through the game's real UI.
  for (const key of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']) {
    await page.keyboard.press(key);
  }
  await expect(page.locator('#status-msg')).toHaveText('Cheat code accepted. Shame.');
  await page.getByLabel('Full name:').fill(name);
}

async function finishSubmission(page) {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Form submitted successfully!');
  await dialog.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(dialog).toContainText('Your form has been lost.');
  await dialog.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.locator('#win')).toBeVisible();
}

for (const { label, input, displayed } of [
  { label: 'entered full name', input: 'Ada Lovelace', displayed: 'Ada Lovelace' },
  { label: 'trimmed Unicode name', input: '  José García  ', displayed: 'José García' },
  { label: 'HTML-like name as literal text', input: '<b>Ada Lovelace</b>', displayed: '<b>Ada Lovelace</b>' }
]) {
  test(`congratulates the ${label}`, async ({ page }) => {
    await prepareForm(page, input);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await finishSubmission(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Congratulations ${displayed} 🎉`);
    await expect(page.locator('#win-name > *')).toHaveCount(0);
    await expect(page.locator('#win-attempts')).toHaveText('1');
  });
}

test('keeps the submitted name during the delayed success flow', async ({ page }) => {
  await prepareForm(page, 'Ada Lovelace');
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  // The form remains editable until the first submission dialog appears.
  await page.getByLabel('Full name:').fill('Grace Hopper');
  await finishSubmission(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Congratulations Ada Lovelace 🎉');
});
