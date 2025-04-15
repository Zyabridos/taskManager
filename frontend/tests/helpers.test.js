import { test, expect } from '@playwright/test';
import { signUpNewUser, LogInExistingUser, logOutUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';

let userData;
let sessionData;

test.beforeAll(async () => {
  userData = await readFixture('users.testData.json');
  sessionData = await readFixture('session.testData.json');
});

const languages = ['ru', 'en', 'no'];

languages.forEach(lng => {
  test.describe(`${lng.toUpperCase()} | Auth helper functions`, () => {
    let email;
    let password;

    test.beforeEach(async ({ page }) => {
      const result = await signUpNewUser(page, lng);
      email = result.email;
      password = result.password;
    });

    test('signUpNewUser creates a new user, redirects to homepage and show a toast', async ({ page }) => {
      const userLng = userData.languages[lng];
      const { url } = sessionData;
      await expect(page).toHaveURL(url.afterSignUp);
      await expect(page.locator(`text=${userLng.messages.signedUp}`)).toBeVisible();
    });

    test('LogInExistingUser logs in the user, redirects to homepage and show a toast', async ({ page }) => {
      const sessionLng = sessionData.languages[lng];
      const { url } = sessionData;
      await LogInExistingUser(page, email, password, lng);
      await expect(page).toHaveURL(url.afterLogin);
      await expect(page.locator(`text=${sessionLng.messages.signedIn}`)).toBeVisible({
        timeout: 10000,
      });
    });

    test('logOutUser logs out the user, redirects to homepage and show a toast', async ({ page }) => {
      const sessionLng = sessionData.languages[lng];
      const { url } = sessionData;
      await LogInExistingUser(page, email, password, lng);
      await logOutUser(page, lng);
      await expect(page).toHaveURL(url.afterLogout);
      await expect(page.locator(`text=${sessionLng.messages.signedOut}`)).toBeVisible({
        timeout: 10000,
      });
    });
  });
});
