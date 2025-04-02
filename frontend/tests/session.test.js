import { test, expect } from '@playwright/test';
import routes from '../src/routes';

test.describe('Auth tests', () => {
  const baseUrl = 'http://localhost:3000';
  test('Sign in existing user', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.session.new()}`);

    await page.getByLabel('Email').fill('example@example.com');
    await page.getByLabel('Пароль').fill('qwerty');

    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(page).toHaveURL(`${baseUrl}/users`);
    await expect(page.locator('text=Вы вошли в систему')).toBeVisible();
  });

  // TODO: Add log out test

  // TODO: Add test on checking errors (sign in and sign out)

  // TODO: Add test on checking of the err 422 on sigm in
});
