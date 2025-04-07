import { test, expect } from '@playwright/test';
import readFixture from './helpers/readFixture.js';
import { LogInExistingUser, signUpNewUser } from './helpers/session.js';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';

let taskData;
let statusData;

test.beforeAll(async () => {
  taskData = await readFixture('tasks.testData.json');
  statusData = await readFixture('statuses.testData.json');
});

test.describe('Tasks CRUD visual (UI)', () => {
  test.beforeEach(async ({ page }) => {
    await signUpNewUser(page, taskData.user.email, taskData.user.password);

    await page.goto(statusData.url.list);
    await clickLinkByName(page, statusData.buttons.create);
    await page.getByLabel(statusData.labels.name).fill(taskData.task.status);
    await clickButtonByName(page, statusData.buttons.create);
  });

  test('Should create new task with required fields', async ({ page }) => {
    await page.goto(taskData.url.create);

    await page.getByLabel(taskData.labels.name).fill(taskData.task.name);
    await page.getByLabel(taskData.labels.status).selectOption({ label: taskData.task.status });

    await clickButtonByName(page, taskData.buttons.create);

    await expect(page).toHaveURL(taskData.url.list);
    await expect(page.locator(`text=${taskData.messages.created}`)).toBeVisible();
    await expect(page.locator(`text=${taskData.task.name}`)).toBeVisible();
  });

  // test('Should show validation errors if required fields - name and status - are empty', async ({
  //   page,
  // }) => {
  //   await page.goto(taskData.url.create);

  //   await clickButtonByName(page, taskData.buttons.create);

  //   await expect(page).toHaveURL(taskData.url.create);

  //   await expect(page.locator(`text=${taskData.errors.nameRequired}`)).toBeVisible();
  //   await expect(page.locator(`text=${taskData.errors.statusRequired}`)).toBeVisible();
  // });

  // test('Should update a specific task', async ({ page }) => {
  //   const updatedName = taskData.task.updated;
  //   await page.goto(taskData.url.list);

  //   const taskRow = page.locator('table tbody tr', { hasText: taskData.task.name });
  //   await expect(taskRow).toBeVisible();

  //   const editLink = taskRow.getByRole('link', { name: taskData.buttons.edit });
  //   await editLink.click();

  //   await page.getByLabel(taskData.labels.name).fill(updatedName);

  //   await page.getByLabel(taskData.labels.status).selectOption({ label: taskData.task.status });

  //   await clickButtonByName(page, taskData.buttons.edit);

  //   await expect(page).toHaveURL(taskData.url.list);
  //   await expect(page.locator(`text=${taskData.messages.updated}`)).toBeVisible();
  //   await expect(page.locator(`text=${updatedName}`)).toBeVisible();
  // });

  // test('Should delete a specific task', async ({ page }) => {
  //   await page.goto(taskData.url.list);

  //   const row = page.locator('table tbody tr', { hasText: taskData.task.updated });

  //   await expect(row).toBeVisible();

  //   const deleteButton = row.getByRole('button', { name: taskData.buttons.delete });

  //   await deleteButton.click();

  //   await expect(page).toHaveURL(taskData.url.list);
  //   await expect(page.locator(`text=${taskData.messages.deleted}`)).toBeVisible();
  //   await expect(page.locator(`text=${taskData.task.name}`)).not.toBeVisible();
  // });
});
