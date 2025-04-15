import { test, expect } from '@playwright/test';
import { signUpNewUser, LogInExistingUser } from './helpers/session.js';
import { clickButtonByName } from './helpers/selectors.js';
import readFixture from './helpers/readFixture.js';

let tasksFixture, statusesFixture, labelsFixture;
const languages = ['ru', 'en', 'no'];

test.beforeAll(async () => {
  tasksFixture = await readFixture('tasks.testData.json');
  statusesFixture = await readFixture('statuses.testData.json');
  labelsFixture = await readFixture('labels.testData.json');
});

languages.forEach((lng) => {
  test.describe(`${lng.toUpperCase()} | Tasks`, () => {
    let taskData, statusData, labelData;
    let taskName, statusName, labelName;

    test.beforeAll(() => {
  statusData = {
    ...statusesFixture.languages[lng],
    url: statusesFixture.url,
  };
  labelData = {
    ...labelsFixture.languages[lng],
    url: labelsFixture.url,
  };
  taskData = {
    ...tasksFixture.languages[lng],
    url: tasksFixture.url,
  };
});

    const authAndPrepareEntities = async (page) => {
      const { email, password } = await signUpNewUser(page, lng);
      await LogInExistingUser(page, email, password, lng);

      taskName = `Task ${Date.now()}`;
      statusName = `Status ${Date.now()}`;
      labelName = `Label ${Date.now()}`;

      await page.goto(statusData.url.create);
      await page.getByLabel(statusData.labels.name).fill(statusName);
      await clickButtonByName(page, statusData.buttons.create);

      await page.goto(labelData.url.create);
      await page.getByLabel(labelData.labels.name).fill(labelName);
      await clickButtonByName(page, labelData.buttons.create);

      await page.goto(taskData.url.create);
      await page.getByLabel(taskData.labels.name).fill(taskName);
      await page.getByLabel(taskData.labels.status).selectOption({ label: statusName });
      await clickButtonByName(page, taskData.buttons.create);

      return { email, password };
    };

    test.describe('Layout and headers', () => {
      test('should display correct table headers', async ({ page }) => {
        await authAndPrepareEntities(page);

        await page.goto(taskData.url.list);
        const ths = page.locator('th');

        await expect(page.getByRole('heading', { name: taskData.table.pageTitle })).toBeVisible();
        await expect(ths.nth(0)).toHaveText(new RegExp(taskData.table.columns.id));
        // default sorting by id, and therefore
        // with first render showed ID ↑, not just ID
        await expect(ths.nth(1)).toHaveText(taskData.table.columns.name);
        await expect(ths.nth(2)).toHaveText(taskData.table.columns.status);
        await expect(ths.nth(3)).toHaveText(taskData.table.columns.executor);
        await expect(ths.nth(4)).toHaveText(taskData.table.columns.createdAt);
        await expect(ths.nth(5)).toHaveText(taskData.table.columns.actions);
      });
    });

    test.describe('Validation', () => {
      test.beforeEach(async ({ page }) => {
        await authAndPrepareEntities(page);
      });

      test('should show error if task name is empty', async ({ page }) => {
        await page.goto(taskData.url.create);
        await clickButtonByName(page, taskData.buttons.create);
        await expect(page.locator(`text=${taskData.errors.nameRequired}`)).toBeVisible();
        await expect(page.locator(`text=${taskData.errors.statusRequired}`)).toBeVisible();
      });

      test('should show error if task name already exists', async ({ page }) => {
        await page.goto(taskData.url.create);
        await page.getByLabel(taskData.labels.name).fill(taskName);
        await page.getByLabel(taskData.labels.status).selectOption({ label: statusName });
        await clickButtonByName(page, taskData.buttons.create);
        await expect(page.locator(`text=${taskData.errors.duplicate}`)).toBeVisible();
      });
    });

    test.describe('Edit and delete', () => {
      test.beforeEach(async ({ page }) => {
        await authAndPrepareEntities(page);
      });

      test('should edit task', async ({ page }) => {
        const updatedName = taskData.task.updated;

        await page.goto(taskData.url.list);
        const row = page.locator('table tbody tr', { hasText: taskName });
        const editLink = row.getByRole('link', { name: taskData.buttons.edit });
        await editLink.click();

        await page.getByLabel(taskData.labels.name).fill(updatedName);
        await clickButtonByName(page, taskData.buttons.edit);

        await expect(page).toHaveURL(taskData.url.list);
        await expect(page.locator(`text=${updatedName}`)).toBeVisible();
      });

      test('should delete task', async ({ page }) => {
        await page.goto(taskData.url.list);
        const row = page.locator('table tbody tr', { hasText: taskName });
        const deleteBtn = row.getByRole('button', { name: taskData.buttons.delete });
        await deleteBtn.click();

        await expect(page.locator(`text=${taskData.messages.deleted}`)).toBeVisible();
        await expect(page.locator(`text=${taskName}`)).not.toBeVisible();
      });
    });
  });
});
