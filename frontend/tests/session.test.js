import { test, expect } from '@playwright/test';
import readFixture from './helpers/readFixture.js';

let sessionData;

test.beforeAll(async () => {
  sessionData = await readFixture('session.testData.json');
});

test.describe('Auth tests (UI)', () => {
  test('Sign in existing user', async ({ page }) => {
    await page.goto(sessionData.url.signIn);

    await page.getByLabel(sessionData.labels.email).fill(sessionData.user.email);
    await page.getByLabel(sessionData.labels.password).fill(sessionData.user.password);

    await page.getByRole('button', { name: sessionData.buttons.signIn }).click();

    await expect(page).toHaveURL(sessionData.url.usersList);
    await expect(page.locator(`text=${sessionData.messages.signedIn}`)).toBeVisible();
  });

  test('Sign out after login', async ({ page }) => {
    await page.goto(sessionData.url.signIn);

    await page.getByLabel(sessionData.labels.email).fill(sessionData.user.email);
    await page.getByLabel(sessionData.labels.password).fill(sessionData.user.password);
    await page.getByRole('button', { name: sessionData.buttons.signIn }).click();
    await expect(page).toHaveURL(sessionData.url.usersList);

    await page.getByRole('link', { name: sessionData.buttons.signOut }).click();

    await expect(page).toHaveURL(sessionData.url.root);
    await expect(page.locator(`text=${sessionData.messages.signedOut}`)).toBeVisible();
  });
});
