import { test, expect } from '@playwright/test';
import routes from '../src/routes';
import { clickButtonByName } from './helpers/selectors.js';
import { LogInExistingUser } from './helpers/session.js';
import { faker } from '@faker-js/faker';

test.describe('users CRUD visual (UI)', () => {
  const baseUrl = 'http://localhost:3000';
  const email = faker.internet.email();
  const firstName = faker.person.firstName();
  const lastName = faker.person.fullName();

  const updatedFirstName = faker.person.firstName();
  const updatedLastName = faker.person.fullName();
  const updatedEmail = faker.internet.email();
  const updatedPassword = faker.internet.password(8)

  test('Should create new user from home page with random email', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByRole('link', { name: 'Регистрация' }).click();
    await page.getByLabel('Имя').fill(firstName);
    await page.getByLabel('Фамилия').fill(lastName);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Пароль').fill('qwerty');

    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(page).toHaveURL(`${baseUrl}${routes.app.users.list()}`);
    await expect(page.locator(`text=${firstName} ${lastName}`)).toBeVisible();
    await expect(page.locator('text=Вы зарегистрированы')).toBeVisible();
  });

  test('Should show list of users from backend', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.session.new()}`);

    await LogInExistingUser(page, email)

    await page.goto(`${baseUrl}${routes.app.users.list()}`);

    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('Should edit a specific user', async ({ page }) => {
    await page.goto(`${baseUrl}${routes.app.session.new()}`);

    // TODO: evnt users can edit only themselvs, so evnt
    // make split this test in 2 - negative and positive case
    await LogInExistingUser(page, email)
    
    await page.goto(`${baseUrl}${routes.app.users.list()}`);

    const row = page.locator('table tbody tr', { hasText: `${firstName} ${lastName}` });
    const editLink = row.getByRole('link', { name: 'Изменить' });
    console.log(editLink)

    await editLink.click();

    const firstNameInput = page.getByLabel('Имя');
    const lastNameInput = page.getByLabel('Фамилия');
    const emailInput = page.getByLabel('Email');
    const passwordInput = page.getByLabel('Пароль');

    await firstNameInput.fill(updatedFirstName);
    await lastNameInput.fill(updatedLastName);
    await emailInput.fill(updatedEmail);
    await passwordInput.fill(updatedPassword);

    await clickButtonByName(page, 'Изменить');

    await expect(page).toHaveURL(`${baseUrl}${routes.app.users.list()}`);

    await expect(page.locator('text=Пользователь обновлён')).toBeVisible();

    await expect(page.locator(`text=${updatedFirstName}`)).toBeVisible();
    await expect(page.locator(`text=${updatedLastName}`)).toBeVisible();
    await expect(page.locator(`text=${updatedEmail}`)).toBeVisible();
  });

  // test('Should delete a specific user', async ({ page }) => {
  //   await page.goto(`${baseUrl}${routes.app.session.new()}`);

  //   await LogInExistingUser(page, email)
    
  //   await page.goto(`${baseUrl}${routes.app.users.list()}`);

  //   const row = page.locator('table tbody tr', { hasText: `${updatedFirstName} ${updatedLastName}` });
  //   const deleteButton = row.getByRole('button', { name: 'Удалить' });
  //   await deleteButton.click();

  //   await expect(page).toHaveURL(`${baseUrl}${routes.app.users.list()}`);
  //   await expect(page.locator('text=Пользователь удалён')).toBeVisible();
  //   await expect(page.locator(`text=${updatedFirstName} ${updatedLastName}`)).not.toBeVisible();
  // });

  // TODO: Should show errors if editing ields are not correct
});
