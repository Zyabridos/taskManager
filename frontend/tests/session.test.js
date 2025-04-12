import { test, expect } from '@playwright/test';
import readFixture from './helpers/readFixture.js';
import { clickButtonByName } from './helpers/selectors.js';
import { signUpNewUser } from './helpers/session.js';

let sessionData;

test.beforeAll(async () => {
  sessionData = await readFixture('session.testData.json');
});

test.describe('Auth tests (UI)', () => {
  test('Should show errors when labels are filled wrong', async ({ page }) => {
    await page.goto(sessionData.url.signIn);

    await clickButtonByName(page, sessionData.buttons.signIn);

    await expect(page.locator(`text=${sessionData.errors.requieredEmail}`)).toBeVisible();
    await expect(page.locator(`text=${sessionData.errors.requieredPassword}`)).toBeVisible();

    await page.getByLabel(sessionData.labels.email).fill(sessionData.user.wrongEmailFormat);
    await page.getByLabel(sessionData.labels.password).fill(sessionData.user.shortPassword);

    await expect(page.locator(`text=${sessionData.errors.wrongEmailFormat}`)).toBeVisible();
    await expect(page.locator(`text=${sessionData.errors.min3symbols}`)).toBeVisible();
  });

  test('Sign in existing user', async ({ page }) => {
    const user = await signUpNewUser(page);

    await page.goto(sessionData.url.signIn);

    await page.getByLabel(sessionData.labels.email).fill(user.email);
    await page.getByLabel(sessionData.labels.password).fill(user.password);

    await clickButtonByName(page, sessionData.buttons.signIn);

    await expect(page).toHaveURL(sessionData.url.usersList);
    await expect(page.locator(`text=${sessionData.messages.signedIn}`)).toBeVisible();
  });

  test('Sign out after login', async ({ page }) => {
    const user = await signUpNewUser(page);

    await page.goto(sessionData.url.signIn);
    await page.getByLabel(sessionData.labels.email).fill(user.email);
    await page.getByLabel(sessionData.labels.password).fill(user.password);
    await clickButtonByName(page, sessionData.buttons.signIn);

    await expect(page).toHaveURL(sessionData.url.usersList);

    await page.goto(sessionData.url.root);
    await clickButtonByName(page, sessionData.buttons.signOut);

    await expect(page).toHaveURL(sessionData.url.root);
    await expect(page.locator(`text=${sessionData.messages.signedOut}`)).toBeVisible();
  });

  test('Should show toast with wrong email/password', async ({ page }) => {
    await page.goto(sessionData.url.signIn);

    await page.getByLabel(sessionData.labels.email).fill('wrong@example.com');
    await page.getByLabel(sessionData.labels.password).fill('invalid');

    await clickButtonByName(page, sessionData.buttons.signIn);

    await expect(page.locator(`text=${sessionData.errors.invalidCredentials}`)).toBeVisible();
  });
});
