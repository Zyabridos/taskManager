import { test, expect } from '@playwright/test';
import readFixture from './helpers/readFixture.js';
import { clickButtonByName } from './helpers/selectors.js';
import { setLanguage } from './helpers/languageSetup.js';
import { LogInExistingUser, logOutUser } from './helpers/session.js';
import createTestUser from './helpers/createTestUser.js';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

let sessionData;

test.beforeAll(async () => {
  sessionData = await readFixture('session.testData.json');
  await createTestUser();
});

const languages = ['ru', 'en', 'no'];

languages.forEach(lng => {
  test.describe(`${lng.toUpperCase()} | Auth tests`, () => {
    let data;
    let url;
    let email;
    let password;

    test.beforeAll(() => {
      data = sessionData.languages[lng];
      url = sessionData.url;
      email = sessionData.existing.email;
      password = sessionData.existing.password;
    });

    test('Should show required errors on empty registration form', async ({ page }) => {
      await page.goto(url.signUp);
      await setLanguage(page, lng);
      await clickButtonByName(page, data.buttons.signUp);

      await expect(page.locator(`text=${data.errors.requieredEmail}`)).toBeVisible();
      await expect(page.locator(`text=${data.errors.requieredPassword}`)).toBeVisible();
      await expect(page.locator(`text=${data.errors.requieredFirstName}`)).toBeVisible();
      await expect(page.locator(`text=${data.errors.requieredLastName}`)).toBeVisible();
    });

    test('Should show errors when labels are filled wrong', async ({ page }) => {
      await page.goto(url.usersList);
      await setLanguage(page, lng);
      await page.goto(url.signIn);

      await clickButtonByName(page, data.buttons.signUp);

      await expect(page.locator(`text=${data.errors.requieredEmail}`)).toBeVisible();
      await expect(page.locator(`text=${data.errors.requieredPassword}`)).toBeVisible();

      await page.getByLabel(data.labels.email).fill('invalid');
      await page.getByLabel(data.labels.password).fill('1');

      await clickButtonByName(page, data.buttons.signUp);

      await expect(page.locator(`text=${data.errors.wrongEmailFormat}`)).toBeVisible();
      await expect(page.locator(`text=${data.errors.min3symbols}`)).toBeVisible();
    });

    test('Should show error when signing up with existing email', async ({ page }) => {
      await page.goto(url.signUp);
      await setLanguage(page, lng);

      await page.getByLabel(data.labels.email).fill(email);
      await page.getByLabel(data.labels.password).fill(password);
      await clickButtonByName(page, data.buttons.signUp);

      await expect(page.locator(`text=${data.errors.emailExists}`)).toBeVisible();
    });

    test('Should sign up with new email and show toast', async ({ page }) => {
      await page.goto(url.signUp);
      await setLanguage(page, lng);

      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const uniqueEmail = `newuser-${uuidv4().slice(0, 8)}@example.com`;
      const newPassword = 'qwerty';

      await page.getByLabel(data.labels.firstName).fill(firstName);
      await page.getByLabel(data.labels.lastName).fill(lastName);
      await page.getByLabel(data.labels.email).fill(uniqueEmail);
      await page.getByLabel(data.labels.password).fill(newPassword);
      await clickButtonByName(page, data.buttons.signUp);

      await expect(page).toHaveURL(url.afterSignUp);
      await expect(page.locator(`text=${data.messages.signedUp}`)).toBeVisible();
    });

    test('Should show toast with wrong email/password', async ({ page }) => {
      await page.goto(url.usersList);
      await setLanguage(page, lng);
      await page.goto(url.signIn);

      await page.getByLabel(data.labels.email).fill('wrong@example.com');
      await page.getByLabel(data.labels.password).fill('invalid');
      await clickButtonByName(page, data.buttons.signUp);

      await expect(page.locator(`text=${data.errors.invalidCredentials}`)).toBeVisible();
    });

    test('LogInExistingUser logs in, redirects and shows toast', async ({ page }) => {
      await LogInExistingUser(page, email, password, lng);
      await expect(page).toHaveURL(url.afterLogin);
      await expect(page.locator(`text=${data.messages.signedIn}`)).toBeVisible();
    });

    test('logOutUser logs out, redirects and shows toast', async ({ page }) => {
      await LogInExistingUser(page, email, password, lng);
      await logOutUser(page, lng);
      await expect(page).toHaveURL(url.afterLogout);
      await expect(page.locator(`text=${data.messages.signedOut}`)).toBeVisible();
    });
  });
});
