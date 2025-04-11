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
    await LogInExistingUser(page, taskData.user.email);

    // Создаём статус "New"
    await page.goto(taskData.url.statuses);
    await clickLinkByName(page, taskData.buttons.createStatus);
    await expect(page.getByLabel(taskData.labels.name)).toBeVisible();
    await page.getByLabel(taskData.labels.name).fill('New');
    await clickButtonByName(page, taskData.buttons.createStatus);

    // Создаём метку "Frontend"
    await page.goto(taskData.url.labels);
    await clickLinkByName(page, taskData.buttons.createLabel);
    await expect(page.getByLabel(taskData.labels.name)).toBeVisible();
    await page.getByLabel(taskData.labels.name).fill('Frontend');
    await clickButtonByName(page, taskData.buttons.createLabel);

    // Создаём 5 задач
    for (let i = 1; i <= 5; i += 1) {
      const taskName = `Task ${i}`;
      await page.goto(taskData.url.create);

      await expect(page.getByLabel(taskData.labels.name)).toBeVisible();
      await page.getByLabel(taskData.labels.name).fill(taskName);

      await page.getByLabel(taskData.labels.status).selectOption({ label: 'New' });
      await page.getByLabel(taskData.labels.label).selectOption({ label: 'Frontend' });

      await clickButtonByName(page, taskData.buttons.create);
      await expect(page).toHaveURL(taskData.url.list);
    }

    await page.goto(taskData.url.list);
  });

  test('should sort by ID asc and desc', async ({ page }) => {
    const getFirstId = async () =>
      Number(await page.locator('tbody tr').first().getAttribute('data-id'));

    await page.locator('thead tr th', { hasText: 'ID' }).click();
    const idDesc = await getFirstId();

    await page.locator('thead tr th', { hasText: 'ID' }).click();
    const idAsc = await getFirstId();

    expect(idDesc).toBeGreaterThan(idAsc);
  });

  test('should sort by name asc and desc', async ({ page }) => {
    const getFirstName = async () =>
      await page.locator('tbody tr td').nth(1).textContent();

    await page.locator('thead tr th', { hasText: 'Наименование' }).click();
    const asc = await getFirstName();

    await page.locator('thead tr th', { hasText: 'Наименование' }).click();
    const desc = await getFirstName();

    expect(asc).not.toEqual(desc);
  });

  test('should sort by status asc and desc', async ({ page }) => {
    const getFirstStatus = async () =>
      await page.locator('tbody tr td').nth(2).textContent();

    await page.locator('thead tr th', { hasText: 'Статус' }).click();
    const asc = await getFirstStatus();

    await page.locator('thead tr th', { hasText: 'Статус' }).click();
    const desc = await getFirstStatus();

    expect(asc).not.toEqual(desc);
  });

  test('should sort by executor first name asc and desc', async ({ page }) => {
    const getFirstExecutor = async () =>
      await page.locator('tbody tr').first().getAttribute('data-executor');

    await page.locator('thead tr th', { hasText: 'Исполнитель' }).click();
    const asc = await getFirstExecutor();

    await page.locator('thead tr th', { hasText: 'Исполнитель' }).click();
    const desc = await getFirstExecutor();

    expect(asc).not.toEqual(desc);
  });

  test('should sort by createdAt asc and desc', async ({ page }) => {
    const getFirstDate = async () =>
      await page.locator('tbody tr').first().getAttribute('data-created-at');

    await page.locator('thead tr th', { hasText: 'Дата создания' }).click();
    const asc = await getFirstDate();

    await page.locator('thead tr th', { hasText: 'Дата создания' }).click();
    const desc = await getFirstDate();

    expect(asc).not.toEqual(desc);
  });
});