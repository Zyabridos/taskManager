import { test, expect } from '@playwright/test';
import { signUpNewUser, LogInExistingUser, logOutUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';

let userData;
let sessionData;

test.beforeAll(async () => {
  userData = await readFixture('users.testData.json');
  sessionData = await readFixture('session.testData.json');
});

test.describe('session.js functions test', () => {
  test('signUpNewUser creates a new user and redirects to users list page', async ({ page }) => {
    const email = `user_${Date.now()}@example.com`;
    const password = 'testpass';

    await signUpNewUser(page, email, password);

    await expect(page).toHaveURL(userData.url.afterSignUp);
    await expect(page.locator(`text=${userData.messages.signedUp}`)).toBeVisible();
  });

  test('LogInExistingUser logs in the user and redirects to homepage', async ({ page }) => {
    const { email, password } = userData.existing;

    await LogInExistingUser(page, email, password);

    await expect(page).toHaveURL(sessionData.url.afterLogin);
    await expect(page.locator(`text=${sessionData.messages.signedIn}`)).toBeVisible();
  });

  test('logOutUser logs out the user and redirects to login page', async ({ page }) => {
    const { email, password } = userData.existing;

    await LogInExistingUser(page, email, password);

    await logOutUser(page);

    await expect(page).toHaveURL(sessionData.url.afterLogout);
    await expect(page.locator(`text=${sessionData.messages.signedOut}`)).toBeVisible();
  });
});
