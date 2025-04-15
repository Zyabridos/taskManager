import { test, expect } from '@playwright/test';
import readFixture from './helpers/readFixture.js';
import { clickButtonByName } from './helpers/selectors.js';
import { setLanguage } from './helpers/languageSetup.js';

let sessionData;

test.beforeAll(async () => {
  sessionData = await readFixture('session.testData.json');
});

const languages = ['ru', 'en', 'no'];

languages.forEach(lng => {
  test.describe(`${lng.toUpperCase()} | Auth tests (UI)`, () => {
    let data;
    let url;
    let commonUser;

    test.beforeAll(() => {
      data = sessionData.languages[lng];
      url = sessionData.url;
      commonUser = sessionData.commonUser;
    });

    test('Should show errors when labels are filled wrong', async ({ page }) => {
      await page.goto(url.usersList);
      await setLanguage(page, lng);
      await page.goto(url.signIn);

      await clickButtonByName(page, data.buttons.signIn);

      await expect(page.locator(`text=${data.errors.requieredEmail}`)).toBeVisible();
      await expect(page.locator(`text=${data.errors.requieredPassword}`)).toBeVisible();

      await page.getByLabel(data.labels.email).fill(commonUser.wrongEmailFormat);
      await page.getByLabel(data.labels.password).fill(commonUser.shortPassword);

      await clickButtonByName(page, data.buttons.signIn);

      await expect(page.locator(`text=${data.errors.wrongEmailFormat}`)).toBeVisible();
      await expect(page.locator(`text=${data.errors.min3symbols}`)).toBeVisible();
    });

    test('Should show toast with wrong email/password', async ({ page }) => {
      await page.goto(url.usersList);
      await setLanguage(page, lng);
      await page.goto(url.signIn);

      await page.getByLabel(data.labels.email).fill('wrong@example.com');
      await page.getByLabel(data.labels.password).fill('invalid');
      await clickButtonByName(page, data.buttons.signIn);

      await expect(page.locator(`text=${data.errors.invalidCredentials}`)).toBeVisible();
    });
  });
});
