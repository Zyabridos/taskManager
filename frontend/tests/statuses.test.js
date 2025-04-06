import { test, expect } from '@playwright/test';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';
import { LogInExistingUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';
import { deleteTaskByName, deleteStatusByName } from './helpers/deleteEntity.js';

let statusData;
let taskData;

test.beforeAll(async () => {
  statusData = await readFixture('statuses.testData.json');
  taskData = await readFixture('tasks.testData.json');
});

test.describe('statuses CRUD visual (UI)', () => {
  test.beforeEach(async ({ page }) => {
    await LogInExistingUser(page, statusData.user.email);
  });

  test('Should show list of statuses from backend', async ({ page }) => {
    await page.goto(statusData.url.list);

    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('Should create new status', async ({ page }) => {
    await page.goto(statusData.url.list);

    await clickLinkByName(page, statusData.buttons.create);
    await expect(page).toHaveURL(statusData.url.new);

    await page.getByLabel(statusData.labels.name).fill(statusData.statuses.new);
    await clickButtonByName(page, statusData.buttons.create);

    await expect(page).toHaveURL(statusData.url.list);
    await expect(page.locator(`text=${statusData.messages.created}`)).toBeVisible();
    await expect(page.locator(`text=${statusData.statuses.new}`)).toBeVisible();
  });

  test('Should NOT allow deleting a status that has a related task', async ({ page }) => {
    await page.goto(statusData.url.list);

    const protectedStatusName = 'Used Status';
    await clickLinkByName(page, statusData.buttons.create);
    await expect(page).toHaveURL(statusData.url.new);
    await page.getByLabel(statusData.labels.name).fill(protectedStatusName);
    await clickButtonByName(page, statusData.buttons.create);
    await expect(page).toHaveURL(statusData.url.list);
    await expect(page.locator(`text=${protectedStatusName}`)).toBeVisible();

    console.log('asjd');
    await page.goto(taskData.url.list);
    console.log('taskData.buttons.create', taskData.buttons.create);
    await clickLinkByName(page, taskData.buttons.create);

    const taskName = 'Test Task with Status';
    console.log('taskData.labels.name', taskData.labels.name);
    await page.getByLabel(taskData.labels.name).fill(taskName);

    const statusSelect = page.getByLabel(taskData.labels.status);
    await statusSelect.selectOption({ label: protectedStatusName });

    await clickButtonByName(page, taskData.buttons.create);
    await expect(page).toHaveURL(taskData.url.list);
    await expect(page.locator(`text=${taskName}`)).toBeVisible();

    await page.goto(statusData.url.list);

    const row = page.locator('table tbody tr', { hasText: protectedStatusName });
    const deleteButton = row.getByRole('button', { name: statusData.buttons.delete });
    await deleteButton.click();

    await expect(page.locator(`text=${statusData.errors.hasTasks}`)).toBeVisible();
    await expect(page.locator(`text=${protectedStatusName}`)).toBeVisible();

    await deleteTaskByName(page, taskName, taskData);

    await deleteStatusByName(page, protectedStatusName, statusData);
  });

  test('Should show error if status name is empty', async ({ page }) => {
    await page.goto(statusData.url.list);

    await clickLinkByName(page, statusData.buttons.create);
    await expect(page).toHaveURL(statusData.url.new);

    await clickButtonByName(page, statusData.buttons.create);

    await expect(page).toHaveURL(statusData.url.new);
    await expect(page.locator(`text=${statusData.errors.validation.required}`)).toBeVisible();
  });

  test('Should show error if status name already exists', async ({ page }) => {
    await page.goto(statusData.url.list);

    await clickLinkByName(page, statusData.buttons.create);
    await expect(page).toHaveURL(statusData.url.new);

    await page.getByLabel(statusData.labels.name).fill(statusData.statuses.new);
    await clickButtonByName(page, statusData.buttons.create);

    await expect(page).toHaveURL(statusData.url.new);
    await expect(page.locator(`text=${statusData.errors.validation.duplicate}`)).toBeVisible();
  });

  test('Should edit a specific status', async ({ page }) => {
    await page.goto(statusData.url.list);

    const row = page.locator('table tbody tr', { hasText: statusData.statuses.new });
    const editLink = row.getByRole('link', { name: `${statusData.buttons.edit}` });

    await editLink.click();

    const updatedName = 'Updated Test Status';
    const nameInput = page.getByLabel(statusData.labels.name);

    await nameInput.fill(updatedName);
    await clickButtonByName(page, `${statusData.buttons.edit}`);

    await expect(page).toHaveURL(statusData.url.list);
    await expect(page.locator(`text=${statusData.messages.updated}`)).toBeVisible();
    await expect(page.locator(`text=${statusData.statuses.updated}`)).toBeVisible();
  });

  test('Should delete a specific status', async ({ page }) => {
    await deleteStatusByName(page, statusData.statuses.new, statusData);
  });
});
