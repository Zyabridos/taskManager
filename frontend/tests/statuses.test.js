import { test, expect } from '@playwright/test';
import routes from '../src/routes';

test.describe('Statuses CRUD visual (UI)', () => {
  const baseUrl = 'http://localhost:3000';
  // TODO - stop using hardcore data
  const email = 'example@example.com';
  const password = 'qwerty';

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/session/new`);

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Пароль').fill(password);
    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(page).toHaveURL(`${baseUrl}${routes.app.users.list()}`);
  });

  test('Should show list of statuses from backend', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.statuses.list()}`);

    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('Should create new status', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.statuses.list()}`);

    await page.getByRole('link', { name: 'Создать статус' }).click();
    await expect(page).toHaveURL(`${baseUrl}${routes.app.statuses.create()}`);

    await page.getByLabel('Наименование').fill('Test Status');
    await page.getByRole('button', { name: 'Создать статус' }).click();

    await expect(page).toHaveURL(`${baseUrl}${routes.app.statuses.list()}`);
    await expect(page.locator('text=Статус создан')).toBeVisible();
    await expect(page.locator('text=Test Status')).toBeVisible();
  });

  test('Should delete a specific status', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.statuses.list()}`);

    const row = page.locator('table tbody tr', { hasText: 'Test Status' });
    await row.getByRole('button', { name: 'Удалить' }).click();

    await expect(page).toHaveURL(`${baseUrl}${routes.app.statuses.list()}`);

    await expect(page.locator('text=Статус удалён')).toBeVisible();
    await expect(page.locator('text=Test Status')).not.toBeVisible();
  });

  test('Should edit a specific status', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.statuses.list()}`);

    const row = page.locator('table tbody tr', { hasText: 'Test Status' });
    const editLink = row.getByRole('link', { name: 'Изменить' });

    await editLink.click();

    await expect(page).toHaveURL(new RegExp(`${routes.app.statuses.edit('').slice(0, -1)}`)); // Проверка на URL /statuses/:id/edit

    const updatedName = 'Updated Test Status';
    const nameInput = page.getByLabel('Наименование');

    await nameInput.fill('');
    await nameInput.fill(updatedName);
    await page.getByRole('button', { name: 'Обновить' }).click();

    await expect(page).toHaveURL(`${baseUrl}${routes.app.statuses.list()}`);
    await expect(page.locator('text=Статус обновлён')).toBeVisible();
    await expect(page.locator(`text=${updatedName}`)).toBeVisible();
  });
});
