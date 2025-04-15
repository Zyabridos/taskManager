import { test, expect } from '@playwright/test';
import { clickButtonByName } from './helpers/selectors.js';
import { signUpNewUser, LogInExistingUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';
import { faker } from '@faker-js/faker';

const prepareUserFixture = async lng => {
  const raw = await readFixture('users.testData.json');
  const lang = raw.languages[lng];

  return {
    ...lang,
    url: raw.url,
    existing: raw.existing,
  };
};

const languages = ['ru', 'en', 'no'];

languages.forEach(lng => {
  test.describe(`${lng.toUpperCase()} | Users UI`, () => {
    let data;

    test.beforeAll(async () => {
      data = await prepareUserFixture(lng);
    });

    test.describe('Layout and headers', () => {
      let email, password;

      test.beforeEach(async ({ page }) => {
        const user = await signUpNewUser(page, lng);
        email = user.email;
        password = user.password;
        await LogInExistingUser(page, email, password, lng);
      });

      test('should display correct page title and table headers', async ({ page }) => {
        await page.goto(data.url.usersList);
        const ths = page.locator('th');

        await expect(page.getByRole('heading', { name: data.table.pageTitle })).toBeVisible();
        // default sorting by id, and therefore
        // with first render showed ID ↑, not just ID
        await expect(ths.nth(0)).toHaveText(new RegExp(data.table.columns.id));
        await expect(ths.nth(1)).toHaveText(data.table.columns.fullName);
        await expect(ths.nth(2)).toHaveText(data.table.columns.email);
        await expect(ths.nth(3)).toHaveText(data.table.columns.createdAt);
        await expect(ths.nth(4)).toHaveText(data.table.columns.actions);
      });

      test('should show list of users', async ({ page }) => {
        await page.goto(data.url.usersList);
        const rows = page.locator('table tbody tr');
        await expect(rows).not.toHaveCount(0);
      });

      test.describe('Edit/delete functionality', () => {
        let email, password, otherEmail;
        let updatedFirstName, updatedLastName, updatedEmail, updatedPassword;

        test.beforeEach(async ({ page }) => {
          const user = await signUpNewUser(page, lng);
          email = user.email;
          password = user.password;
          await LogInExistingUser(page, email, password, lng);

          otherEmail = faker.internet.email();
          const otherPassword = faker.internet.password();

          await page.goto(data.url.signUp);
          await page.getByLabel(data.labels.firstName).fill(faker.person.firstName());
          await page.getByLabel(data.labels.lastName).fill(faker.person.lastName());
          await page.getByLabel(data.labels.email).fill(otherEmail);
          await page.getByLabel(data.labels.password).fill(otherPassword);
          await clickButtonByName(page, data.buttons.signUp);

          updatedFirstName = faker.person.firstName();
          updatedLastName = faker.person.lastName();
          updatedEmail = faker.internet.email();
          updatedPassword = faker.internet.password();
        });

        test('should show delete button only for current user', async ({ page }) => {
          await page.goto(data.url.usersList);
          const deleteButtons = page.locator(
            `table tbody tr >> role=button[name="${data.buttons.delete}"]`,
          );
          await expect(deleteButtons).toHaveCount(1);
        });

        test('should allow user to edit themselves', async ({ page }) => {
          await page.goto(data.url.usersList);
          const row = page.locator(`[data-email="${email}"]`);
          await row.getByRole('link', { name: data.buttons.edit }).click();

          await page.getByLabel(data.labels.firstName).fill(updatedFirstName);
          await page.getByLabel(data.labels.lastName).fill(updatedLastName);
          await page.getByLabel(data.labels.email).fill(updatedEmail);
          await page.getByLabel(data.labels.password).fill(updatedPassword);

          await clickButtonByName(page, data.buttons.edit);
          await expect(page).toHaveURL(data.url.usersList);
          await expect(page.locator(`text=${data.messages.updated}`)).toBeVisible();
        });

        test('should be able to delete itself', async ({ page }) => {
          await page.goto(data.url.usersList);
          const row = page.locator(`[data-email="${email}"]`);
          await row.getByRole('button', { name: data.buttons.delete }).click();

          await expect(page.locator(`text=${data.messages.deleted}`)).toBeVisible();
          await expect(page.locator(`[data-email="${email}"]`)).toHaveCount(0);
        });
      });

      test.describe('Access control', () => {
        let email, password, otherEmail;

        test.beforeEach(async ({ page }) => {
          const user = await signUpNewUser(page, lng);
          email = user.email;
          password = user.password;
          await LogInExistingUser(page, email, password, lng);

          const otherPassword = faker.internet.password();
          await page.goto(data.url.signUp);
          await page.getByLabel(data.labels.firstName).fill(faker.person.firstName());
          await page.getByLabel(data.labels.lastName).fill(faker.person.lastName());
          otherEmail = faker.internet.email();
          await page.getByLabel(data.labels.email).fill(otherEmail);
          await page.getByLabel(data.labels.password).fill(otherPassword);
          await clickButtonByName(page, data.buttons.signUp);
        });

        test('should redirect with toast when trying to edit another user', async ({ page }) => {
          await page.goto(data.url.usersList);
          const otherRow = page.locator(`[data-email="${otherEmail}"]`);
          const otherUserId = await otherRow.getAttribute('data-id');

          await page.goto(`${data.url.usersList}/${otherUserId}/edit`);
          await expect(page).toHaveURL(data.url.usersList);
          await expect(page.locator(`text=${data.errors.notOwner}`)).toBeVisible();
        });
      });
    });
  });
});
