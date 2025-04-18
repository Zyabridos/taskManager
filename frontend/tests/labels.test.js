import { test, expect } from '@playwright/test';
import { clickButtonByName } from './helpers/selectors.js';
import { LogInExistingUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';
import { v4 as uuidv4 } from 'uuid';
import createTestUser from './helpers/createTestUser.js';

let labelsFixture;
const languages = ['ru', 'en', 'no'];
const testUser = { email: 'testuser@example.com', password: 'qwerty' };

test.beforeAll(async () => {
  labelsFixture = await readFixture('labels.testData.json');
  await createTestUser();
});

languages.forEach(lng => {
  test.describe(`${lng.toUpperCase()} | Labels tests`, () => {
    let data;
    let url;
    let labelsData;
    let updatedName;

    test.beforeAll(() => {
      data = labelsFixture.languages[lng];
      url = labelsFixture.url;
      labelsData = data.labelsData;
    });

    test.describe('Layout and headers', () => {
      test.beforeEach(async ({ page }) => {
        await LogInExistingUser(page, testUser.email, testUser.password, lng);
      });

      test('should display correct page title and table headers', async ({ page }) => {
        await page.goto(url.list);
        const ths = page.locator('th');

        await expect(page.getByRole('heading', { name: data.table.pageTitle })).toBeVisible();
        // default sorting by id, and therefore
        // with first render showed ID ↑, not just ID
        await expect(ths.nth(0)).toHaveText(new RegExp(data.table.columns.id));
        await expect(ths.nth(1)).toHaveText(data.table.columns.name);
        await expect(ths.nth(2)).toHaveText(data.table.columns.createdAt);
        await expect(ths.nth(3)).toHaveText(data.table.columns.actions);
      });
    });

    test.describe('Validation', () => {
      test.beforeEach(async ({ page }) => {
        await LogInExistingUser(page, testUser.email, testUser.password, lng);
      });

      test('should show error if label name is empty', async ({ page }) => {
        await page.goto(url.create);
        await clickButtonByName(page, data.buttons.create);
        await expect(page.locator(`text=${data.errors.validation.required}`)).toBeVisible();
      });

      test('should show error if label name already exists', async ({ page }) => {
        const labelName = `${labelsData.new} ${uuidv4().slice(0, 8)}`;

        await page.goto(url.create);
        await page.getByLabel(data.labels.name).fill(labelName);
        await clickButtonByName(page, data.buttons.create);
        await expect(page.locator(`text=${data.messages.created}`)).toBeVisible();

        await page.goto(url.create);
        await page.getByLabel(data.labels.name).fill(labelName);
        await clickButtonByName(page, data.buttons.create);
        await expect(page.locator(`text=${data.errors.validation.duplicate}`)).toBeVisible();
      });
    });

    test.describe('CRUD', () => {
      let labelName;

      test.beforeEach(async ({ page }) => {
        await LogInExistingUser(page, testUser.email, testUser.password, lng);

        labelName = `${labelsData.new} ${uuidv4().slice(0, 8)}`;
        await page.goto(url.create);
        await page.getByLabel(data.labels.name).fill(labelName);
        await clickButtonByName(page, data.buttons.create);
        await expect(page.locator(`text=${data.messages.created}`)).toBeVisible();
      });

      test('should show created label in list', async ({ page }) => {
        await page.goto(url.list);
        await expect(page.locator(`text=${labelName}`)).toBeVisible();
      });

      test('should edit the label', async ({ page }) => {
        updatedName = `${labelsData.updated} ${uuidv4().slice(0, 8)}`;
        await page.goto(url.list);

        const row = page.locator('table tbody tr', { hasText: labelName });
        const editLink = row.getByRole('link', { name: data.buttons.edit });
        await editLink.click();

        await page.getByLabel(data.labels.name).fill(updatedName);
        await clickButtonByName(page, data.buttons.confirmEdit);

        await expect(page).toHaveURL(url.list);
        await expect(page.locator(`text=${data.messages.updated}`)).toBeVisible();
        await expect(page.locator(`text=${updatedName}`)).toBeVisible();
      });

      test('should delete the label', async ({ page }) => {
        await page.goto(url.list);

        const row = page.locator('table tbody tr', { hasText: updatedName });
        const deleteButton = row.getByRole('button', { name: data.buttons.delete });
        await deleteButton.click();

        await expect(page.locator(`text=${data.messages.deleted}`)).toBeVisible();
        await expect(page.locator(`text=${updatedName}`)).not.toBeVisible();
      });
    });
  });
});
