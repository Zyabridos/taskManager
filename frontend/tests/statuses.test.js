import { test, expect } from '@playwright/test';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';
import { LogInExistingUser } from './helpers/session.js';
import readFixture from './helpers/readFixture.js';

let statusData;

test.beforeAll(async () => {
  statusData = await readFixture('statuses.testData.json');
});

test.describe('statuses CRUD visual (UI)', () => {
  test.beforeEach(async ({ page }) => {
    await LogInExistingUser(page, 'example@example.com');
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
    await page.goto(statusData.url.list);

    const row = page.locator('table tbody tr', { hasText: statusData.statuses.updated });
    const deleteButton = row.getByRole('button', { name: statusData.buttons.delete });
    await deleteButton.click();

    await expect(page).toHaveURL(statusData.url.list);
    await expect(page.locator(`text=${statusData.messages.deleted}`)).toBeVisible();
    await expect(page.locator(`text=${statusData.statuses.updated}`)).not.toBeVisible();
  });
});
