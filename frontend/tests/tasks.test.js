import { test, expect } from '@playwright/test';
import { signUpNewUser, LogInExistingUser } from './helpers/session.js';
import { clickButtonByName } from './helpers/selectors.js';
import readFixture from './helpers/readFixture.js';

let taskData;
let statusData;
let labelData;

test.beforeAll(async () => {
  taskData = await readFixture('tasks.testData.json');
  statusData = await readFixture('statuses.testData.json');
  labelData = await readFixture('labels.testData.json');
});

test.describe('tasks CRUD visual (UI)', () => {
  let email;
  let password;
  let statusName;
  let labelName;
  let taskName;

  test.beforeEach(async ({ page }) => {
    const user = await signUpNewUser(page);
    email = user.email;
    password = user.password;
    taskName = `Task ${Date.now()}`;
    statusName = `Status ${Date.now()}`;
    labelName = `Label ${Date.now()}`;

    await LogInExistingUser(page, email, password);

    await page.goto(statusData.url.create);
    await page.getByLabel(statusData.labels.name).fill(statusName);
    await clickButtonByName(page, statusData.buttons.create);
    await expect(page.locator(`text=${statusName}`)).toBeVisible();

    await page.goto(labelData.url.create);
    await page.getByLabel(labelData.labels.name).fill(labelName);
    await clickButtonByName(page, labelData.buttons.create);
    await expect(page.locator(`text=${labelName}`)).toBeVisible();

    await page.goto(taskData.url.create);
    await page.getByLabel(taskData.labels.name).fill(taskName);
    await page.getByLabel(taskData.labels.status).selectOption({ label: statusName });
    await clickButtonByName(page, taskData.buttons.create);
    await expect(page.locator(`text=${taskName}`)).toBeVisible();
  });

  test('Should show created task in list', async ({ page }) => {
    await page.goto(taskData.url.list);
    await expect(page.locator(`text=${taskName}`)).toBeVisible();
  });

  test('Should show error if task name is empty', async ({ page }) => {
    await page.goto(taskData.url.create);
    await clickButtonByName(page, taskData.buttons.create);
    await expect(page.locator(`text=${taskData.errors.nameRequired}`)).toBeVisible();
    await expect(page.locator(`text=${taskData.errors.statusRequired}`)).toBeVisible();
  });

  test('Should show error if task name already exists', async ({ page }) => {
    await page.goto(taskData.url.create);
    await page.getByLabel(taskData.labels.name).fill(taskName);
    await page.getByLabel(taskData.labels.status).selectOption({ label: statusName });
    await clickButtonByName(page, taskData.buttons.create);
    await expect(page.locator(`text=${taskData.errors.duplicate}`)).toBeVisible();
  });

  test('Should edit created task', async ({ page }) => {
    const updatedName = `${taskName} Updated`;

    await page.goto(taskData.url.list);
    const row = page.locator('table tbody tr', { hasText: taskName });
    const editLink = row.getByRole('link', { name: taskData.buttons.edit });
    await editLink.click();

    await page.getByLabel(taskData.labels.name).fill(updatedName);
    await clickButtonByName(page, taskData.buttons.edit);

    await expect(page).toHaveURL(taskData.url.list);
    await expect(page.locator(`text=${updatedName}`)).toBeVisible();
  });

  test('Should delete created task', async ({ page }) => {
    const updatedName = `${taskName} Updated`;

    await page.goto(taskData.url.list);
    const row = page.locator('table tbody tr', { hasText: updatedName });
    const deleteBtn = row.getByRole('button', { name: taskData.buttons.delete });
    await deleteBtn.click();

    await expect(page.locator(`text=${taskData.messages.deleted}`)).toBeVisible();
    await expect(page.locator(`text=${updatedName}`)).not.toBeVisible();
  });
});
