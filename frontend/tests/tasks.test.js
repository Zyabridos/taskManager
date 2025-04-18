import { test, expect } from '@playwright/test';
import { LogInExistingUser } from './helpers/session.js';
import { clickButtonByName } from './helpers/selectors.js';
import readFixture from './helpers/readFixture.js';
import { v4 as uuidv4 } from 'uuid';
import createTestUser from './helpers/createTestUser.js';

let tasksFixture, statusesFixture, labelsFixture;
const languages = ['ru', 'en', 'no'];

test.beforeAll(async () => {
  tasksFixture = await readFixture('tasks.testData.json');
  statusesFixture = await readFixture('statuses.testData.json');
  labelsFixture = await readFixture('labels.testData.json');
  await createTestUser();
});

languages.forEach(lng => {
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

    const authAndPrepareEntities = async page => {
      await LogInExistingUser(
        page,
        tasksFixture.existing.email,
        tasksFixture.existing.password,
        lng
      );

      taskName = `Task ${uuidv4().slice(0, 8)}`;
      statusName = `Status ${uuidv4().slice(0, 8)}`;
      labelName = `Label ${uuidv4().slice(0, 8)}`;

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
    };

    test.describe('Layout and headers', () => {
      test('should display correct table headers', async ({ page }) => {
        await authAndPrepareEntities(page);

        await page.goto(taskData.url.list);
        const ths = page.locator('th');

        await expect(page.getByRole('heading', { name: taskData.table.pageTitle })).toBeVisible();
        await expect(ths.nth(0)).toHaveText(new RegExp(taskData.table.columns.id));
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

    test.describe('Edit/delete functionality', () => {
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

    test.describe('Sorting', () => {
      let secondStatusName;

      test.beforeEach(async ({ page }) => {
        await authAndPrepareEntities(page);

        secondStatusName = `Z-Status ${uuidv4().slice(0, 8)}`;
        await page.goto(statusData.url.create);
        await page.getByLabel(statusData.labels.name).fill(secondStatusName);
        await clickButtonByName(page, statusData.buttons.create);

        const secondTaskName = `B-${taskName}`;
        await page.goto(taskData.url.create);
        await page.getByLabel(taskData.labels.name).fill(secondTaskName);
        await page.getByLabel(taskData.labels.status).selectOption({ label: secondStatusName });
        await clickButtonByName(page, taskData.buttons.create);

        await page.goto(taskData.url.list);
        await expect(page.locator('body')).toContainText(taskName);
        await expect(page.locator('body')).toContainText(secondTaskName);
      });

      test('should sort by task name', async ({ page }) => {
        await page.goto(taskData.url.list);

        const header = page.locator('thead tr th', { hasText: taskData.table.columns.name });
        await header.click();
        const firstNameAsc = await page.locator('tbody tr td').nth(1).textContent();

        await header.click();
        const firstNameDesc = await page.locator('tbody tr td').nth(1).textContent();

        expect(firstNameAsc).not.toEqual(firstNameDesc);
      });

      test('should sort by status', async ({ page }) => {
        await page.goto(taskData.url.list);

        const header = page.locator('thead tr th', { hasText: taskData.table.columns.status });
        await header.click();
        const firstStatusAsc = await page.locator('tbody tr td').nth(2).textContent();

        await header.click();
        const firstStatusDesc = await page.locator('tbody tr td').nth(2).textContent();

        expect(firstStatusAsc).not.toEqual(firstStatusDesc);
        expect([statusName, secondStatusName]).toContain(firstStatusAsc?.trim());
        expect([statusName, secondStatusName]).toContain(firstStatusDesc?.trim());
      });
    });
  });
});
