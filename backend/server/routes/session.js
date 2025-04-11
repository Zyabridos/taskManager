import { test, expect, request } from '@playwright/test';
import axios from 'axios';

import readFixture from './helpers/readFixture.js';
import { clickButtonByName } from './helpers/selectors.js';

let sessionData;

// Создаём пользователя напрямую через API
const createTestUser = async (user) => {
  try {
    await axios.post('http://localhost:5001/api/users', user, {
      withCredentials: true,
    });
  } catch (err) {
    if (err.response?.status !== 422) {
      throw err;
    }
    // пользователь уже существует — ок
  }
};

test.beforeAll(async () => {
  sessionData = await readFixture('session.testData.json');

  await createTestUser({
    email: sessionData.user.email,
    password: sessionData.user.password,
    firstName: sessionData.user.firstName || 'Test',
    lastName: sessionData.user.lastName || 'User',
  });
});

test.describe('Auth tests (UI)', () => {
  test('Should show toast with wrong email/password', async ({ page }) => {
    await page.goto(sessionData.url.signIn);

    await page.getByLabel(sessionData.labels.email).fill('wrong@email.com');
    await page.getByLabel(sessionData.labels.password).fill('wrongpassword');

    await clickButtonByName(page, sessionData.buttons.signIn);

    await expect(page.locator(`text=${sessionData.messages.loginFailed}`)).toBeVisible();
  });

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
    await page.goto(sessionData.url.signIn);

    await page.getByLabel(sessionData.labels.email).fill(sessionData.user.email);
    await page.getByLabel(sessionData.labels.password).fill(sessionData.user.password);

    await clickButtonByName(page, sessionData.buttons.signIn);

    await expect(page).toHaveURL(sessionData.url.usersList);
    await expect(page.locator(`text=${sessionData.messages.signedIn}`)).toBeVisible();
  });

  test('Sign out after login', async ({ page }) => {
    await page.goto(sessionData.url.signIn);

    await page.getByLabel(sessionData.labels.email).fill(sessionData.user.email);
    await page.getByLabel(sessionData.labels.password).fill(sessionData.user.password);
    await clickButtonByName(page, sessionData.buttons.signIn);

    await expect(page).toHaveURL(sessionData.url.usersList);
    await page.goto(sessionData.url.root);

    await clickButtonByName(page, sessionData.buttons.signOut);

    await expect(page).toHaveURL(sessionData.url.root);
    await expect(page.locator(`text=${sessionData.messages.signedOut}`)).toBeVisible();
  });
});
