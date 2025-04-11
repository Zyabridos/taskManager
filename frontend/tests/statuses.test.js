import { test, expect } from '@playwright/test';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';
import { signUpNewUser, LogInExistingUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';

let statusData;
let statusName;

test.beforeAll(async () => {
  statusData = await readFixture('statuses.testData.json');
});

test.describe('statuses CRUD visual (UI)', () => {
  let email;
  let password;

  test.beforeEach(async ({ page }) => {
    const newUser = await signUpNewUser(page);
    email = newUser.email;
    password = newUser.password;
    statusName = `Status ${Date.now()}`;

    await LogInExistingUser(page, email, password);

    await page.goto(statusData.url.new);
    await page.getByLabel(statusData.labels.name).fill(statusName);
    await clickButtonByName(page, statusData.buttons.create);

    await expect(page.locator(`text=${statusData.messages.created}`)).toBeVisible();
    await expect(page.locator(`text=${statusName}`)).toBeVisible();
  });

  test('Should show created status in list', async ({ page }) => {
    await page.goto(statusData.url.list);
    await expect(page.locator(`text=${statusName}`)).toBeVisible();
  });

  test('Should show error if status name is empty', async ({ page }) => {
    await page.goto(statusData.url.new);
    await clickButtonByName(page, statusData.buttons.create);
    await expect(page.locator(`text=${statusData.errors.validation.required}`)).toBeVisible();
  });

  test('Should show error if status name already exists', async ({ page }) => {
    await page.goto(statusData.url.new);
    await page.getByLabel(statusData.labels.name).fill(statusName);
    await clickButtonByName(page, statusData.buttons.create);
    await expect(page.locator(`text=${statusData.errors.validation.duplicate}`)).toBeVisible();
  });

  test('Should edit a specific status', async ({ page }) => {
    const updatedName = `${statusName} Updated`;

    await page.goto(statusData.url.list);
    const row = page.locator('table tbody tr', { hasText: statusName });
    const editLink = row.getByRole('link', { name: statusData.buttons.edit });
    await editLink.click();

    await page.getByLabel(statusData.labels.name).fill(updatedName);
    await clickButtonByName(page, statusData.buttons.edit);

    await expect(page).toHaveURL(statusData.url.list);
    await expect(page.locator(`text=${statusData.messages.updated}`)).toBeVisible();
    await expect(page.locator(`text=${updatedName}`)).toBeVisible();
  });

  test('Should delete the created status', async ({ page }) => {
    await page.goto(statusData.url.list);

    const row = page.locator('table tbody tr', { hasText: statusName });
    const deleteButton = row.getByRole('button', { name: statusData.buttons.delete });
    await deleteButton.click();

    await expect(page.locator(`text=${statusData.messages.deleted}`)).toBeVisible();
    await expect(page.locator(`text=${statusName}`)).not.toBeVisible();
  });
});
