import { test, expect } from '@playwright/test';
import { clickButtonByName } from './helpers/selectors.js';
import { signUpNewUser, LogInExistingUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';

let labelData;

test.beforeAll(async () => {
  labelData = await readFixture('labels.testData.json');
});

const languages = ['ru', 'en', 'no'];

languages.forEach(lng => {
  test.describe(`${lng.toUpperCase()}`, () => {
    let data;

    test.beforeAll(async () => {
      const raw = await readFixture('labels.testData.json');
      data = raw.languages[lng];
    });

    test.describe('Layout and headers', () => {
      test('should display correct page title and table headers', async ({ page }) => {
        const { email, password } = await signUpNewUser(page, lng);
        await LogInExistingUser(page, email, password);
        await page.evaluate(lng => {
          localStorage.setItem('i18nextLng', lng);
        }, lng);
        await page.goto(data.url.list);

        const ths = page.locator('th');
        await expect(page.getByRole('heading', { name: data.table.pageTitle })).toBeVisible();
        await expect(ths.nth(0)).toHaveText(new RegExp(data.table.columns.id));
        await expect(ths.nth(1)).toHaveText(data.table.columns.name);
        await expect(ths.nth(2)).toHaveText(data.table.columns.createdAt);
        await expect(ths.nth(3)).toHaveText(data.table.columns.actions);
      });
    });

    test.describe('Validation', () => {
      test.beforeEach(async ({ page }) => {
        const { email, password } = await signUpNewUser(page, lng);

        await page.goto(data.url.list);

        await page.evaluate(lng => {
          localStorage.setItem('i18nextLng', lng);
        }, lng);

        await LogInExistingUser(page, email, password);
      });

      test('should show error if label name is empty', async ({ page }) => {
        await page.goto(data.url.create);
        await clickButtonByName(page, data.buttons.create);
        await expect(page.locator(`text=${data.errors.validation.required}`)).toBeVisible();
      });

      test('should show error if label name already exists', async ({ page }) => {
        const labelName = `Label ${Date.now()}`;
        await page.goto(data.url.create);
        await page.getByLabel(data.labels.name).fill(labelName);
        await clickButtonByName(page, data.buttons.create);
        await expect(page.locator(`text=${labelName}`)).toBeVisible();

        await page.goto(data.url.create);
        await page.getByLabel(data.labels.name).fill(labelName);
        await clickButtonByName(page, data.buttons.create);
        await expect(page.locator(`text=${data.errors.validation.duplicate}`)).toBeVisible();
      });
    });

    test.describe('CRUD', () => {
      let labelName;

      test.beforeEach(async ({ page }) => {
        const { email, password } = await signUpNewUser(page, lng);
        labelName = `Label ${Date.now()}`;
        await LogInExistingUser(page, email, password);
        await page.evaluate(lng => {
          localStorage.setItem('i18nextLng', lng);
        }, lng);
        await page.goto(data.url.create);
        await page.getByLabel(data.labels.name).fill(labelName);
        await clickButtonByName(page, data.buttons.create);
        await expect(page.locator(`text=${labelName}`)).toBeVisible();
      });

      test('should show created label in list', async ({ page }) => {
        await page.goto(data.url.list);
        await expect(page.locator(`text=${labelName}`)).toBeVisible();
      });

      test('should edit a specific label', async ({ page }) => {
        await page.goto(data.url.list);
        const row = page.locator('table tbody tr', { hasText: labelName });
        const editLink = row.getByRole('link', { name: data.buttons.edit });
        await editLink.click();

        await page.getByLabel(data.labels.name).fill(data.labelsData.updated);
        await clickButtonByName(page, data.buttons.edit);

        await expect(page).toHaveURL(data.url.list);
        await expect(page.locator(`text=${data.messages.updated}`)).toBeVisible();
        await expect(page.locator(`text=${data.labelsData.updated}`)).toBeVisible();
      });

      test('should delete created label', async ({ page }) => {
        await page.goto(data.url.list);
        const row = page.locator('table tbody tr', { hasText: labelName });
        const editLink = row.getByRole('link', { name: data.buttons.edit });
        await editLink.click();

        await page.getByLabel(data.labels.name).fill(data.labelsData.updated);
        await clickButtonByName(page, data.buttons.edit);

        await page.goto(data.url.list);
        const updatedRow = page.locator('table tbody tr', { hasText: data.labelsData.updated });
        const deleteButton = updatedRow.getByRole('button', { name: data.buttons.delete });
        await deleteButton.click();

        await expect(page.locator(`text=${data.messages.deleted}`)).toBeVisible();
        await expect(page.locator(`text=${data.labelsData.updated}`)).not.toBeVisible();
      });
    });
  });
});
