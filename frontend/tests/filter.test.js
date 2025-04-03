import { test, expect } from '@playwright/test';
import readFixture from './helpers/readFixture.js';
import { LogInExistingUser } from './helpers/session.js';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';

test.setTimeout(20000);

let taskData;
let statusData;
let labelsData

test.beforeAll(async () => {
  taskData = await readFixture('tasks.testData.json');
  statusData = await readFixture('statuses.testData.json');
  labelsData = await readFixture('labels.testData.json');
});

test.describe('Tasks List Filter UI', () => {
  test.beforeEach(async ({ page }) => {
    await LogInExistingUser(page, taskData.user.email);

    await page.goto(statusData.url.list);
    await clickLinkByName(page, statusData.buttons.create);
    await page.getByLabel(statusData.labels.name).fill(taskData.task.status);
    await clickButtonByName(page, statusData.buttons.create);
    
    await page.goto(labelsData.url.list);
    await clickLinkByName(page, labelsData.buttons.create);
    await page.getByLabel(labelsData.labels.name).fill(taskData.task.label);
    await clickButtonByName(page, labelsData.buttons.create);

    await page.goto(taskData.url.list);
    const deleteButtons = await page.locator(`button:has-text("${taskData.buttons.delete}")`).all();
    for (const btn of deleteButtons) {
      await btn.click();
    }

    await page.goto(taskData.url.create);
    taskData.task.name = `Task ${Date.now()}`;
    await page.getByLabel(taskData.labels.name).fill(taskData.task.name);
    await page.getByLabel(taskData.labels.status).selectOption({ label: taskData.task.status });
    await clickButtonByName(page, taskData.buttons.create);
    await expect(page.locator(`text=${taskData.messages.created}`)).toBeVisible();
  });

  test('Should filter tasks by status', async ({ page }) => {
    await page.goto(taskData.url.list);

    await page.getByLabel('Статус').selectOption({ label: taskData.task.status });

    await page.locator('form').getByRole('button', { name: taskData.buttons.applyFilter }).click();

    const filteredRow = page.locator('table tbody tr', { hasText: taskData.task.name });
    await expect(filteredRow).toBeVisible();
  });

  test('Should filter tasks by label', async ({ page }) => {
    await page.goto(taskData.url.list);

    await page.getByLabel(taskData.labels.label).selectOption({ label: taskData.task.label });

    await page.locator('form').getByRole('button', { name: taskData.buttons.applyFilter }).click();

    const filteredRow = page.locator('table tbody tr', { hasText: taskData.task.name });
    await expect(filteredRow).toBeVisible();
  });

  test('Should filter tasks by creator (checkbox only my tasks)', async ({ page }) => {
    await page.goto(taskData.url.list);

    const checkbox = page.getByLabel(taskData.labels.onlyMyTasks);
    await checkbox.check();

    await page.locator('form').getByRole('button', { name: taskData.buttons.applyFilter }).click();

    const filteredRow = page.locator('table tbody tr', { hasText: taskData.task.name });
    await expect(filteredRow).toBeVisible();
  });

  test('Should filter tasks by status, label and author', async ({ page }) => {
    await page.goto(taskData.url.list);

    await page.getByLabel(taskData.labels.status).selectOption({ label: taskData.task.status });
    await page.getByLabel(taskData.labels.label).selectOption({ label: taskData.task.label });

    const checkbox = page.getByLabel(taskData.labels.onlyMyTasks);
    await checkbox.check();

    await page.locator('form').getByRole('button', { name: taskData.buttons.applyFilter }).click();

    const filteredRow = page.locator('table tbody tr', { hasText: taskData.task.name });
    await expect(filteredRow).toHaveCount(1);
    await expect(filteredRow).toBeVisible();
  });
});
