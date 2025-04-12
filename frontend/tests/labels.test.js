import { test, expect } from '@playwright/test';
import { clickButtonByName } from './helpers/selectors.js';
import { signUpNewUser, LogInExistingUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';

let labelData;

test.beforeAll(async () => {
  labelData = await readFixture('labels.testData.json');
});

test.describe('labels layout and headers', () => {
  test('Should display correct page title and table headers', async ({ page }) => {
    const { email, password } = await signUpNewUser(page);
    const { url, table } = labelData;

    await LogInExistingUser(page, email, password);
    await page.goto(url.list);

    const ths = page.locator('th');
    await expect(page.getByRole('heading', { name: table.pageTitle })).toBeVisible();
    // default sorting by id, and therefore
    // with first render showed ID ↑, not just ID
    await expect(ths.nth(0)).toHaveText(new RegExp(table.columns.id));
    await expect(ths.nth(1)).toHaveText(table.columns.name);
    await expect(ths.nth(2)).toHaveText(table.columns.createdAt);
    await expect(ths.nth(3)).toHaveText(table.columns.actions);

    await expect(page.getByRole('heading', { name: table.pageTitle })).toBeVisible();
  });
});

test.describe('labels validation', () => {
  let email;
  let password;

  test.beforeEach(async ({ page }) => {
    const newUser = await signUpNewUser(page);
    email = newUser.email;
    password = newUser.password;
    await LogInExistingUser(page, email, password);
  });

  test('Should show error if label name is empty', async ({ page }) => {
    await page.goto(labelData.url.create);
    await clickButtonByName(page, labelData.buttons.create);
    await expect(page.locator(`text=${labelData.errors.validation.required}`)).toBeVisible();
  });

  test('Should show error if label name already exists', async ({ page }) => {
    const labelName = `Label ${Date.now()}`;
    await page.goto(labelData.url.create);
    await page.getByLabel(labelData.labels.name).fill(labelName);
    await clickButtonByName(page, labelData.buttons.create);
    await expect(page.locator(`text=${labelName}`)).toBeVisible();

    await page.goto(labelData.url.create);
    await page.getByLabel(labelData.labels.name).fill(labelName);
    await clickButtonByName(page, labelData.buttons.create);
    await expect(page.locator(`text=${labelData.errors.validation.duplicate}`)).toBeVisible();
  });
});

test.describe('labels CRUD', () => {
  let email;
  let password;
  let labelName;

  test.beforeEach(async ({ page }) => {
    const newUser = await signUpNewUser(page);
    email = newUser.email;
    password = newUser.password;
    labelName = `Label ${Date.now()}`;

    await LogInExistingUser(page, email, password);

    await page.goto(labelData.url.create);
    await page.getByLabel(labelData.labels.name).fill(labelName);
    await clickButtonByName(page, labelData.buttons.create);
    await expect(page.locator(`text=${labelName}`)).toBeVisible();
  });

  test('Should show created label in list', async ({ page }) => {
    await page.goto(labelData.url.list);
    await expect(page.locator(`text=${labelName}`)).toBeVisible();
  });

  test('Should edit a specific label', async ({ page }) => {
    await page.goto(labelData.url.list);
    const row = page.locator('table tbody tr', { hasText: labelName });
    const editLink = row.getByRole('link', { name: labelData.buttons.edit });
    await editLink.click();

    await page.getByLabel(labelData.labels.name).fill(labelData.labelsData.updated);
    await clickButtonByName(page, labelData.buttons.edit);

    await expect(page).toHaveURL(labelData.url.list);
    await expect(page.locator(`text=${labelData.messages.updated}`)).toBeVisible();
    await expect(page.locator(`text=${labelData.labelsData.updated}`)).toBeVisible();
  });

  test('Should delete created label', async ({ page }) => {
    await page.goto(labelData.url.list);
    const row = page.locator('table tbody tr', { hasText: labelName });
    const editLink = row.getByRole('link', { name: labelData.buttons.edit });
    await editLink.click();

    await page.getByLabel(labelData.labels.name).fill(labelData.labelsData.updated);
    await clickButtonByName(page, labelData.buttons.edit);

    await page.goto(labelData.url.list);
    const updatedRow = page.locator('table tbody tr', { hasText: labelData.labelsData.updated });
    const deleteButton = updatedRow.getByRole('button', { name: labelData.buttons.delete });
    await deleteButton.click();

    await expect(page.locator(`text=${labelData.messages.deleted}`)).toBeVisible();
    await expect(page.locator(`text=${labelData.labelsData.updated}`)).not.toBeVisible();
  });
});
