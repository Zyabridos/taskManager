import { test, expect } from '@playwright/test';
import readFixture from './helpers/readFixture.js';
import { LogInExistingUser, signUpNewUser } from './helpers/session.js';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';

let taskData;

test.beforeAll(async () => {
  taskData = await readFixture('tasks.testData.json');
});

test.describe('Tasks sorting', () => {
  test.beforeEach(async ({ page }) => {
    await LogInExistingUser(page, taskData.user.email);
    await page.goto(taskData.url.list);

    for (let i = 0; i < 5; i += 1) {
      await signUpNewUser(page);
    }

    for (const status of taskData.statuses) {
      await page.goto(taskData.url.statuses);
      await clickLinkByName(page, taskData.buttons.createStatus);
      await page.getByLabel(taskData.labels.name).fill(status.name);
      await clickButtonByName(page, taskData.buttons.createStatus);
    }

    for (const label of taskData.labelsList) {
      await page.goto(taskData.url.labels);
      await clickLinkByName(page, taskData.buttons.createLabel);
      await page.getByLabel(taskData.labels.name).fill(label.name);
      await clickButtonByName(page, taskData.buttons.createLabel);
    }

    await page.goto(taskData.url.list);
  });

  test('should sort by ID asc and desc', async ({ page }) => {
    const getFirstId = async () =>
      Number(await page.locator('tbody tr').first().getAttribute('data-id'));

    // TODO: here and futher is a temp solution - move from hardcorelabels
    await page.locator('thead tr th', { hasText: 'ID' }).click();
    const idDesc = await getFirstId();

    await page.locator('thead tr th', { hasText: 'ID' }).click();
    const idAsc = await getFirstId();

    expect(idDesc).toBeGreaterThan(idAsc);
  })

  test('should sort by name asc and desc', async ({ page }) => {
    const getFirstExecutor = async () =>
      await page.locator('tbody tr').first().getAttribute('data-executor');
    
    await page.locator('thead tr th', { hasText: 'Наименование' }).click();
    const asc = await getFirstExecutor();

    await page.locator('thead tr th', { hasText: 'Наименование' }).click();
    const desc = await getFirstExecutor();

    expect(asc).not.toEqual(desc);
  });

  test('should sort by status asc and desc', async ({ page }) => {
    const getFirstStatus = async () =>
      await page.locator('tbody tr').first().locator('td').nth(2).textContent();

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
