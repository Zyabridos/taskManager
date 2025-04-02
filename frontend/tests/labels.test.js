import { test, expect } from '@playwright/test';
import routes from '../src/routes';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';
import { LogInExistingUser } from './helpers/session.js';

test.describe('labels CRUD visual (UI)', () => {
  const baseUrl = 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    await LogInExistingUser(page, 'example@example.com');
  });

  test('Should show list of labels from backend', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.labels.list()}`);

    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('Should create new label', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.labels.list()}`);

    await clickLinkByName(page, 'Создать метку');
    await expect(page).toHaveURL(`${baseUrl}${routes.app.labels.create()}`);

    await page.getByLabel('Наименование').fill('Test label');
    await clickButtonByName(page, 'Создать метку');

    await expect(page).toHaveURL(`${baseUrl}${routes.app.labels.list()}`);
    await expect(page.locator('text=Метка создана')).toBeVisible();
    await expect(page.locator('text=Test label')).toBeVisible();
  });

  test('Should show error if label name is empty', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.labels.list()}`);

    await clickLinkByName(page, 'Создать метку');
    await expect(page).toHaveURL(`${baseUrl}${routes.app.labels.create()}`);

    await clickButtonByName(page, 'Создать метку');

    await expect(page).toHaveURL(`${baseUrl}${routes.app.labels.create()}`);
    await expect(page.locator('text=Имя обязательно')).toBeVisible();
  });

  // TODO: Should show error if label name already exists

  test('Should edit a specific label', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.labels.list()}`);

    const row = page.locator('table tbody tr', { hasText: 'Test label' });
    const editLink = row.getByRole('link', { name: 'Изменить' });

    await editLink.click();

    const updatedName = 'Updated Test label';
    const nameInput = page.getByLabel('Наименование');

    await nameInput.fill(updatedName);
    await clickButtonByName(page, 'Изменить');

    await expect(page).toHaveURL(`${baseUrl}${routes.app.labels.list()}`);
    await expect(page.locator('text=Метка обновлена')).toBeVisible();
    await expect(page.locator(`text=${updatedName}`)).toBeVisible();
  });

  test('Should delete a specific label', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.labels.list()}`);

    const row = page.locator('table tbody tr', { hasText: 'Test label' });
    const deleteButton = row.getByRole('button', { name: 'Удалить' });
    await deleteButton.click();

    await expect(page).toHaveURL(`${baseUrl}${routes.app.labels.list()}`);
    await expect(page.locator('text=Метка удалена')).toBeVisible();
    await expect(page.locator('text=Test label')).not.toBeVisible();
  });
});
