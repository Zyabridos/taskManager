import { test, expect } from '@playwright/test';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';
import { LogInExistingUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';

let labelData;

test.beforeAll(async () => {
  labelData = await readFixture('labels.testData.json');
});

test.describe('labels CRUD visual (UI)', () => {
  test.beforeEach(async ({ page }) => {
    await LogInExistingUser(page, labelData.user.email);
  });

  test('Should show list of labels from backend', async ({ page }) => {
    await page.goto(labelData.url.list);

    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('Should create new label', async ({ page }) => {
    await page.goto(labelData.url.list);

    await clickLinkByName(page, labelData.buttons.create);
    await expect(page).toHaveURL(labelData.url.new);

    await page.getByLabel(labelData.labels.name).fill(labelData.labelsData.new);
    await clickButtonByName(page, labelData.buttons.create);

    await expect(page).toHaveURL(labelData.url.list);
    await expect(page.locator(`text=${labelData.messages.created}`)).toBeVisible();
    await expect(page.locator(`text=${labelData.labelsData.new}`)).toBeVisible();
  });

  test('Should show error if label name is empty', async ({ page }) => {
    await page.goto(labelData.url.new);

    await clickButtonByName(page, labelData.buttons.create);

    await expect(page).toHaveURL(labelData.url.new);
    await expect(page.locator(`text=${labelData.errors.validation.required}`)).toBeVisible();
  });

  test('Should show error if label name already exists', async ({ page }) => {
    await page.goto(labelData.url.new);

    await page.getByLabel(labelData.labels.name).fill(labelData.labelsData.new);
    await clickButtonByName(page, labelData.buttons.create);

    await expect(page).toHaveURL(labelData.url.new);
    await expect(page.locator(`text=${labelData.errors.validation.duplicate}`)).toBeVisible();
  });

  test('Should edit a specific label', async ({ page }) => {
    await page.goto(labelData.url.list);

    const row = page.locator('table tbody tr', { hasText: labelData.labelsData.new });
    const editLink = row.getByRole('link', { name: labelData.buttons.edit });
    await editLink.click();

    await page.getByLabel(labelData.labels.name).fill(labelData.labelsData.updated);
    await clickButtonByName(page, labelData.buttons.edit);

    await expect(page).toHaveURL(labelData.url.list);
    await expect(page.locator(`text=${labelData.messages.updated}`)).toBeVisible();
    await expect(page.locator(`text=${labelData.labelsData.updated}`)).toBeVisible();
  });

  test('Should delete a specific label', async ({ page }) => {
    await page.goto(labelData.url.list);

    const row = page.locator('table tbody tr', { hasText: labelData.labelsData.updated });
    const deleteButton = row.getByRole('button', { name: labelData.buttons.delete });
    await deleteButton.click();

    await expect(page).toHaveURL(labelData.url.list);
    await expect(page.locator(`text=${labelData.messages.deleted}`)).toBeVisible();
    await expect(page.locator(`text=${labelData.labelsData.updated}`)).not.toBeVisible();
  });
});