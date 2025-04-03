import { test, expect } from '@playwright/test';
import readFixture from './helpers/readFixture.js';
import { clickButtonByName } from './helpers/selectors.js';

let sessionData;

test.beforeAll(async () => {
  sessionData = await readFixture('session.testData.json');
});

test.describe('Auth tests (UI)', () => {
  test('Sign in existing user', async ({ page }) => {
    await page.goto(sessionData.url.signIn);

    await page.getByLabel(sessionData.labels.email).fill(sessionData.user.email);
    await page.getByLabel(sessionData.labels.password).fill(sessionData.user.password);

    clickButtonByName(sessionData.buttons.signIn);

    await expect(page).toHaveURL(sessionData.url.usersList);
    await expect(page.locator(`text=${sessionData.messages.signedIn}`)).toBeVisible();
  });

  test('Sign out after login', async ({ page }) => {
    await page.goto(sessionData.url.signIn);

    await page.getByLabel(sessionData.labels.email).fill(sessionData.user.email);
    await page.getByLabel(sessionData.labels.password).fill(sessionData.user.password);
    clickButtonByName(sessionData.buttons.signIn);
    await expect(page).toHaveURL(sessionData.url.usersList);

    clickButtonByName(sessionData.buttons.signOut);

    await expect(page).toHaveURL(sessionData.url.root);
    await expect(page.locator(`text=${sessionData.messages.signedOut}`)).toBeVisible();
  });
});
