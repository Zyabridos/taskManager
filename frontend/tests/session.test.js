import { test, expect } from '@playwright/test';

test.describe('Аутентификация', () => {
  const baseUrl = 'http://localhost:3000';

  test('Регистрация нового пользователя', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByRole('link', { name: 'Регистрация' }).click();

    await page.getByLabel('Имя').fill('Name');
    await page.getByLabel('Фамилия').fill('Surname');
    await page.getByLabel('Email').fill('example@example.com');
    await page.getByLabel('Пароль').fill('qwerty');

    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(page).toHaveURL(`${baseUrl}/users`);
    await expect(page.getByText('Вы успешно зарегистрированы', { exact: true })).toBeVisible();
    // await expect(page.locator('text=Вы успешно зарегистрированы')).toBeVisible();
  });

  test('Вход существующего пользователя', async ({ page }) => {
    await page.goto(`${baseUrl}/session/new`);

    await page.getByLabel('Email').fill('testuser@example.com');
    await page.getByLabel('Пароль').fill('qwerty');

    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(page).toHaveURL(`${baseUrl}/users`);
    await expect(page.getByText('Вы успешно вошли в систему', { exact: true })).toBeVisible();
  });
});
