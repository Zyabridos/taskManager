import { test, expect } from '@playwright/test';
import readFixture from './helpers/readFixture.js';
import { LogInExistingUser } from './helpers/session.js';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';

let taskData;

test.beforeAll(async () => {
  taskData = await readFixture('tasks.testData.json');
});

test.describe('Tasks sorting', () => {
  test.beforeEach(async ({ page }) => {
    await LogInExistingUser(page, 'example@example.com');
    await page.goto(taskData.url.list);

    for (const user of taskData.users) {
      await page.goto(taskData.url.users);
      await clickLinkByName(page, taskData.buttons.create);
      await page.getByLabel(taskData.labels.firstName).fill(user.firstName);
      await page.getByLabel(taskData.labels.lastName).fill(user.lastName);
      await page.getByLabel(taskData.labels.email).fill(user.email);
      await page.getByLabel(taskData.labels.password).fill(user.password);
      await clickButtonByName(page, taskData.buttons.create);
    }

    for (const status of taskData.statuses) {
      await page.goto(taskData.url.statuses);
      await clickLinkByName(page, taskData.buttons.create);
      await page.getByLabel(taskData.labels.name).fill(status.name);
      await clickButtonByName(page, taskData.buttons.create);
    }

    for (const label of taskData.labelsList) {
      await page.goto(taskData.url.labels);
      await clickLinkByName(page, taskData.buttons.create);
      await page.getByLabel(taskData.labels.name).fill(label.name);
      await clickButtonByName(page, taskData.buttons.create);
    }

    await page.goto(taskData.url.list);
  });

  test('should sort by ID asc and desc', async ({ page }) => {
    const getFirstId = async () =>
      Number(await page.locator('tbody tr:first-child td').first().textContent());

    await page.getByRole('columnheader', { name: taskData.columns.id }).click(); // ASC
    const idAsc = await getFirstId();

    await page.getByRole('columnheader', { name: taskData.columns.id }).click(); // DESC
    const idDesc = await getFirstId();

    expect(idDesc).toBeGreaterThan(idAsc);
  });

  test('should sort by executor first name asc and desc', async ({ page }) => {
    const getFirstExecutor = async () =>
      await page.locator('tbody tr:first-child td').nth(3).textContent();

    await page.getByRole('columnheader', { name: taskData.columns.executor }).click();
    const executorAsc = await getFirstExecutor();

    await page.getByRole('columnheader', { name: taskData.columns.executor }).click();
    const executorDesc = await getFirstExecutor();

    expect(executorAsc).not.toEqual(executorDesc);
  });

  test('should sort by status asc and desc', async ({ page }) => {
    const getFirstStatus = async () =>
      await page.locator('tbody tr:first-child td').nth(2).textContent();

    await page.getByRole('columnheader', { name: taskData.columns.status }).click();
    const statusAsc = await getFirstStatus();

    await page.getByRole('columnheader', { name: taskData.columns.status }).click();
    const statusDesc = await getFirstStatus();

    expect(statusAsc).not.toEqual(statusDesc);
  });

  test('should sort by createdAt asc and desc', async ({ page }) => {
    const getFirstDate = async () =>
      await page.locator('tbody tr:first-child td').nth(4).textContent();

    await page.getByRole('columnheader', { name: taskData.columns.createdAt }).click();
    const dateAsc = await getFirstDate();

    await page.getByRole('columnheader', { name: taskData.columns.createdAt }).click();
    const dateDesc = await getFirstDate();

    expect(dateAsc).not.toEqual(dateDesc);
  });
});
