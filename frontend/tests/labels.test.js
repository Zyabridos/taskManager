import { test, expect } from '@playwright/test';
import { clickButtonByName } from './helpers/selectors.js';
import { signUpNewUser, LogInExistingUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';

let labelData;

test.beforeAll(async () => {
  labelData = await readFixture('labels.testData.json');
});

test.describe('labels CRUD visual (UI)', () => {
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

  test('Should show error if label name is empty', async ({ page }) => {
    await page.goto(labelData.url.create);
    await clickButtonByName(page, labelData.buttons.create);
    await expect(page.locator(`text=${labelData.errors.validation.required}`)).toBeVisible();
  });

  test('Should show error if label name already exists', async ({ page }) => {
    await page.goto(labelData.url.create);
    await page.getByLabel(labelData.labels.name).fill(labelName);
    await clickButtonByName(page, labelData.buttons.create);
    await expect(page.locator(`text=${labelData.errors.validation.duplicate}`)).toBeVisible();
  });

  test('Should edit a specific label', async ({ page }) => {
    await page.goto(labelData.url.create);
    await page.getByLabel(labelData.labels.name).fill(labelName);
    await clickButtonByName(page, labelData.buttons.create);

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
