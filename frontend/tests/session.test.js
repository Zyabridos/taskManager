import { test, expect } from '@playwright/test';
import routes from '../src/routes';
import { faker } from '@faker-js/faker';

test.describe('Auth tests', () => {
  const baseUrl = 'http://localhost:3000';

  test('Sign up new user from home page with random email', async ({ page }) => {
    const email = faker.internet.email();

    await page.goto(baseUrl);
    await page.getByRole('link', { name: 'Регистрация' }).click();

    await page.getByLabel('Имя').fill('Name');
    await page.getByLabel('Фамилия').fill('Surname');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Пароль').fill('qwerty');

    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(page).toHaveURL(`${baseUrl}/users`);
    await expect(page.locator('text=Вы зарегистрированы')).toBeVisible();
  });

  test('Sign in existing user', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.session.new()}`);

    await page.getByLabel('Email').fill('testuser@example.com');
    await page.getByLabel('Пароль').fill('qwerty');

    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(page).toHaveURL(`${baseUrl}/users`);
    await expect(page.locator('text=Вы вошли в систему')).toBeVisible();
  });

  // TODO: Add log out test

  // TODO: Add test on checking errors (sign in and sign out)

  // TODO: Add test on checking of the err 422 on sigm in
});
