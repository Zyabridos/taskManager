import { test, expect } from '@playwright/test';
import readFixture from './helpers/readFixture.js';
import { authAndGoToList } from './helpers/session.js';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';

let tasksFixture;
let statusesFixture;
let labelsFixture;
let tasksUrl;

test.beforeAll(async () => {
  tasksFixture = await readFixture('tasks.testData.json');
  statusesFixture = await readFixture('statuses.testData.json');
  labelsFixture = await readFixture('labels.testData.json');
  tasksUrl = tasksFixture.url;
});

const languages = ['ru', 'en', 'no'];

languages.forEach(lng => {
  test.describe(`${lng.toUpperCase()} | Tasks List Filter`, () => {
    let taskData, statusData, labelData, taskName;

    test.beforeAll(() => {
      taskData = tasksFixture.languages[lng];
      statusData = statusesFixture.languages[lng];
      labelData = labelsFixture.languages[lng];
    });

    test.beforeEach(async ({ page }) => {
      await authAndGoToList(page, statusesFixture.url, lng);

      // Create status
      await page.goto(statusesFixture.url.list);
      await clickLinkByName(page, statusData.buttons.create);
      await page.getByLabel(statusData.labels.name).fill(taskData.task.status);
      await clickButtonByName(page, statusData.buttons.create);

      // Create label
      await page.goto(labelsFixture.url.list);
      await clickLinkByName(page, labelData.buttons.create);
      await page.getByLabel(labelData.labels.name).fill(taskData.task.label);
      await clickButtonByName(page, labelData.buttons.create);

      // Create task
      await page.goto(tasksUrl.create);
      taskName = `Task ${Date.now()}`;
      await page.getByLabel(taskData.labels.name).fill(taskName);
      await page.getByLabel(taskData.labels.status).selectOption({ label: taskData.task.status });
      await page.getByLabel(taskData.labels.label).selectOption({ label: taskData.task.label });
      await clickButtonByName(page, taskData.buttons.create);
      await expect(page.locator(`text=${taskData.messages.created}`)).toBeVisible();
    });

    test('Should filter tasks by status', async ({ page }) => {
      await page.goto(tasksUrl.list);
      await page.getByLabel(taskData.labels.status).selectOption({ label: taskData.task.status });
      await page
        .locator('form')
        .getByRole('button', { name: taskData.buttons.applyFilter })
        .click();
      const rows = page.locator('table tbody tr');
      await expect(rows).toHaveCount(1);
      await expect(rows.first()).toContainText(taskName);
    });

    test('Should filter tasks by label', async ({ page }) => {
      await page.goto(tasksUrl.list);
      await page.getByLabel(taskData.labels.label).selectOption({ label: taskData.task.label });
      await page
        .locator('form')
        .getByRole('button', { name: taskData.buttons.applyFilter })
        .click();
      const rows = page.locator('table tbody tr');
      await expect(rows).toHaveCount(1);
      await expect(rows.first()).toContainText(taskName);
    });

    test('Should filter tasks by creator (only my tasks)', async ({ page }) => {
      await page.goto(tasksUrl.list);
      const checkbox = page.getByLabel(taskData.labels.onlyMyTasks);
      await checkbox.check();
      await page
        .locator('form')
        .getByRole('button', { name: taskData.buttons.applyFilter })
        .click();
      const rows = page.locator('table tbody tr');
      await expect(rows).toHaveCount(1);
      await expect(rows.first()).toContainText(taskName);
    });

    test('Should filter tasks by status, label and author', async ({ page }) => {
      await page.goto(tasksUrl.list);
      await page.getByLabel(taskData.labels.status).selectOption({ label: taskData.task.status });
      await page.getByLabel(taskData.labels.label).selectOption({ label: taskData.task.label });
      await page.getByLabel(taskData.labels.onlyMyTasks).check();
      await page
        .locator('form')
        .getByRole('button', { name: taskData.buttons.applyFilter })
        .click();

      const rows = page.locator('table tbody tr');
      await expect(rows).toHaveCount(1);
      await expect(rows.first()).toContainText(taskName);
    });
  });
});
