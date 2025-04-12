import { test, expect } from '@playwright/test';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';
import { signUpNewUser, LogInExistingUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';

let statusData;
let statusName;

test.beforeAll(async () => {
  statusData = await readFixture('statuses.testData.json');
});

test.describe('statuses layout and headers', () => {
  test('Should display correct page title and table headers', async ({ page }) => {
    const { email, password } = await signUpNewUser(page);
    const { url, table } = statusData;

    await LogInExistingUser(page, email, password);

    await page.goto(url.list);

    const headers = await page.getByRole('columnheader').allTextContents();
    console.log('Column headers:', headers);

    await expect(page.getByRole('heading', { name: table.pageTitle })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /^ID/ })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: table.columns.name })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: table.columns.createdAt })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: table.columns.actions })).toBeVisible();
  });
});

test.describe('statuses layout and headers', () => {
  test.beforeEach(async ({ page }) => {
    const { email, password } = await signUpNewUser(page);
    await LogInExistingUser(page, email, password);
  });

  test('Should show error if status name is empty', async ({ page }) => {
    await page.goto(statusData.url.create);
    await clickButtonByName(page, statusData.buttons.create);
    await expect(page.locator(`text=${statusData.errors.validation.required}`)).toBeVisible();
  });

  test('Should show error if status name already exists', async ({ page }) => {
    const uniqueStatus = `Status ${Date.now()}`;
    await page.goto(statusData.url.create);
    await page.getByLabel(statusData.labels.name).fill(uniqueStatus);
    await clickButtonByName(page, statusData.buttons.create);
    await expect(page.locator(`text=${statusData.messages.created}`)).toBeVisible();

    await page.goto(statusData.url.create);
    await page.getByLabel(statusData.labels.name).fill(uniqueStatus);
    await clickButtonByName(page, statusData.buttons.create);
    await expect(page.locator(`text=${statusData.errors.validation.duplicate}`)).toBeVisible();
  });
});

test.describe('statuses edit/delete functionality', () => {
  let email, password;

  test.beforeEach(async ({ page }) => {
    const user = await signUpNewUser(page);
    email = user.email;
    password = user.password;
    statusName = `Status ${Date.now()}`;

    await LogInExistingUser(page, email, password);

    await page.goto(statusData.url.create);
    await page.getByLabel(statusData.labels.name).fill(statusName);
    await clickButtonByName(page, statusData.buttons.create);

    await expect(page.locator(`text=${statusData.messages.created}`)).toBeVisible();
  });

  test('Should show created status in list', async ({ page }) => {
    await page.goto(statusData.url.list);
    await expect(page.locator(`text=${statusName}`)).toBeVisible();
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
