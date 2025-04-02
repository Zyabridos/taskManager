import { test, expect } from '@playwright/test';
import routes from '../src/routes';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';
import { LogInExistingUser } from './helpers/session.js';
import { faker } from '@faker-js/faker';

test.describe('tasks CRUD visual (UI)', () => {
  const baseUrl = 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    await LogInExistingUser(page, 'example@example.com');
  });

  test('Should show list of tasks from backend', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.tasks.list()}`);

    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('Should create new task', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.task.list()}`);

    await clickLinkByName(page, 'Создать задачу');
    await expect(page).toHaveURL(`${baseUrl}${routes.app.statuses.create()}`);

    await page.getByLabel('Наименование').fill('Test Task');
    await page.getByRole('select').fill('Test Task');
    await page.getByLabel('Наименование').fill('Test Task');
    await page.getByLabel('Наименование').fill('Test Task');
    await page.getByLabel('Наименование').fill('Test Task');
    await clickButtonByName(page, 'Создать задачу');

    await expect(page).toHaveURL(`${baseUrl}${routes.app.tasks.list()}`);
    await expect(page.locator('text=Задача создана')).toBeVisible();
    await expect(page.locator('text=Test Task')).toBeVisible();
  });

  // test('Should show error if status name is empty', async ({ page }) => {
  //   await page.goto(`${baseUrl}${routes.app.statuses.list()}`);

  //   await clickLinkByName(page, 'Создать статус');
  //   await expect(page).toHaveURL(`${baseUrl}${routes.app.statuses.create()}`);

  //   await clickButtonByName(page, 'Создать статус');

  //   await expect(page).toHaveURL(`${baseUrl}${routes.app.statuses.create()}`);
  //   await expect(page.locator('text=Имя обязательно')).toBeVisible();
  // });

  // test('Should edit a specific status', async ({ page }) => {
  //   await page.goto(`${baseUrl}${routes.app.statuses.list()}`);

  //   const row = page.locator('table tbody tr', { hasText: 'Test Status' });
  //   const editLink = row.getByRole('link', { name: 'Изменить' });

  //   await editLink.click();

  //   const updatedName = 'Updated Test Status';
  //   const nameInput = page.getByLabel('Наименование');

  //   await nameInput.fill(updatedName);
  //   await clickButtonByName(page, 'Изменить');

  //   await expect(page).toHaveURL(`${baseUrl}${routes.app.statuses.list()}`);
  //   await expect(page.locator('text=Статус обновлён')).toBeVisible();
  //   await expect(page.locator(`text=${updatedName}`)).toBeVisible();
  // });

  // test('Should delete a specific status', async ({ page }) => {
  //   await page.goto(`${baseUrl}${routes.app.statuses.list()}`);

  //   const row = page.locator('table tbody tr', { hasText: 'Test Status' });
  //   const deleteButton = row.getByRole('button', { name: 'Удалить' });
  //   await deleteButton.click();

  //   await expect(page).toHaveURL(`${baseUrl}${routes.app.statuses.list()}`);
  //   await expect(page.locator('text=Статус удалён')).toBeVisible();
  //   await expect(page.locator('text=Test Status')).not.toBeVisible();
  // });
});
