import { test, expect } from '@playwright/test';
import { clickButtonByName } from './helpers/selectors.js';
import { signUpNewUser, LogInExistingUser, authAndGoToList } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';
import { v4 as uuidv4 } from 'uuid';

let statusesFixture;
const languages = ['ru', 'en', 'no'];

test.beforeAll(async () => {
  statusesFixture = await readFixture('statuses.testData.json');
});

languages.forEach(lng => {
  test.describe(`${lng.toUpperCase()} | Statuses tests`, () => {
    let data;
    let url;
    let statusesData;
    let updatedName;

    test.beforeAll(() => {
      data = statusesFixture.languages[lng];
      url = statusesFixture.url;
      statusesData = statusesFixture.statusesData;
    });

    test.describe('Layout and headers', () => {
      test('should display correct page title and table headers', async ({ page }) => {
        await authAndGoToList(page, url, lng);

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
        await authAndGoToList(page, url, lng);
      });

      test('should show error if status name already exists', async ({ page }) => {
        // создаём уникальное имя на основе локализованного "Новый статус"
        const baseName = data.statusesData.new;
        const uniqueName = `${baseName} ${uuidv4().slice(0, 8)}`;

        await page.goto(url.create);
        await page.getByLabel(data.labels.name).fill(uniqueName);
        await clickButtonByName(page, data.buttons.create);
        await expect(page.locator(`text=${data.messages.created}`)).toBeVisible();

        // пытаемся создать тот же самый статус снова
        await page.goto(url.create);
        await page.getByLabel(data.labels.name).fill(uniqueName);
        await clickButtonByName(page, data.buttons.create);
        await expect(page.locator(`text=${data.errors.validation.duplicate}`)).toBeVisible();
      });
    });

    test.describe('CRUD', () => {
      let statusName;

      test.beforeEach(async ({ page }) => {
        const { email, password } = await signUpNewUser(page, lng);
        await LogInExistingUser(page, email, password, lng);

        statusName = `${data.statusesData.new} ${uuidv4().slice(0, 8)}`;
        await page.goto(url.create);
        await page.getByLabel(data.labels.name).fill(statusName);
        await clickButtonByName(page, data.buttons.create);
        await expect(page.locator(`text=${data.messages.created}`)).toBeVisible();
      });

      test('should show created status in list', async ({ page }) => {
        await page.goto(url.list);
        await expect(page.locator(`text=${statusName}`)).toBeVisible();
      });

      test('should edit the status', async ({ page }) => {
        updatedName = `${data.statusesData.updated} ${uuidv4().slice(0, 8)}`;
        await page.goto(url.list);

        const row = page.locator('tr', { has: page.locator(`td[data-name="${statusName}"]`) });
        await row.getByRole('link', { name: data.buttons.edit }).click();

        await page.getByLabel(data.labels.name).fill(updatedName);
        await clickButtonByName(page, data.buttons.confirmEdit);

        await expect(page).toHaveURL(url.list);
        await expect(page.locator(`text=${data.messages.updated}`)).toBeVisible();
        await expect(page.locator(`text=${updatedName}`)).toBeVisible();
      });

      test('should delete the status', async ({ page }) => {
        await page.goto(url.list);

        const row = page.locator('tr', {
          has: page.locator(`td[data-name="${updatedName}"]`),
        });
        const deleteButton = row.getByRole('button', { name: data.buttons.delete });
        await deleteButton.click();

        await expect(page.locator(`text=${data.messages.deleted}`)).toBeVisible();
        await expect(page.locator(`td[data-name="${updatedName}"]`)).not.toBeVisible();
      });
    });
  });
});
