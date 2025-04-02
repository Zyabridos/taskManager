import { test, expect } from '@playwright/test';
import { clickButtonByName } from './helpers/selectors.js';
import { LogInExistingUser } from './helpers/session.js';
import { faker } from '@faker-js/faker';
import readFixture from './helpers/readFixture.js';

let userData;

test.beforeAll(async () => {
  userData = await readFixture('users.testData.json');
});

test.describe('users CRUD visual (UI)', () => {
  const email = faker.internet.email();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const updatedFirstName = faker.person.firstName();
  const updatedLastName = faker.person.lastName();
  const updatedEmail = faker.internet.email();
  const updatedPassword = faker.internet.password(8);

  test('Should create new user from home page', async ({ page }) => {
    await page.goto(userData.url.root);
    await page.getByRole('link', { name: userData.links.signUp }).click();

    await page.getByLabel(userData.labels.firstName).fill(firstName);
    await page.getByLabel(userData.labels.lastName).fill(lastName);
    await page.getByLabel(userData.labels.email).fill(email);
    await page.getByLabel(userData.labels.password).fill(userData.testUser.password);

    await page.getByRole('button', { name: userData.buttons.signUp }).click();

    await expect(page).toHaveURL(userData.url.usersList);
    await expect(page.locator(`text=${firstName} ${lastName}`)).toBeVisible();
    await expect(page.locator(`text=${userData.messages.signedUp}`)).toBeVisible();
  });

  test('Should show list of users', async ({ page }) => {
    await page.goto(userData.url.signIn);
    await LogInExistingUser(page, email);

    await page.goto(userData.url.usersList);
    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('Should show error if email already in use', async ({ page }) => {
    await page.goto(userData.url.root);
    await page.getByRole('link', { name: userData.links.signUp }).click();

    await page.getByLabel(userData.labels.firstName).fill(firstName);
    await page.getByLabel(userData.labels.lastName).fill(lastName);
    await page.getByLabel(userData.labels.email).fill(email);
    await page.getByLabel(userData.labels.password).fill(userData.testUser.password);

    await page.getByRole('button', { name: userData.buttons.signUp }).click();

    await expect(page).toHaveURL(userData.url.signUp);
    await expect(page.locator(`text=${userData.errors.emailExists}`)).toBeVisible();
  });

  test('Should edit a specific user', async ({ page }) => {
    await page.goto(userData.url.signIn);
    await LogInExistingUser(page, email);

    // TODO: evnt users can edit only themselvs, so evnt
    // split this test in 2 - negative and positive case

    await page.goto(userData.url.usersList);
    const row = page.locator('table tbody tr', { hasText: `${firstName} ${lastName}` });
    const editLink = row.getByRole('link', { name: userData.buttons.edit });
    await editLink.click();

    await page.getByLabel(userData.labels.firstName).fill(updatedFirstName);
    await page.getByLabel(userData.labels.lastName).fill(updatedLastName);
    await page.getByLabel(userData.labels.email).fill(updatedEmail);
    await page.getByLabel(userData.labels.password).fill(updatedPassword);

    await clickButtonByName(page, userData.buttons.edit);

    await expect(page).toHaveURL(userData.url.usersList);
    await expect(page.locator(`text=${userData.messages.updated}`)).toBeVisible();
    await expect(page.locator(`text=${updatedFirstName}`)).toBeVisible();
    await expect(page.locator(`text=${updatedLastName}`)).toBeVisible();
    await expect(page.locator(`text=${updatedEmail}`)).toBeVisible();
  });

  test('Should delete a user', async ({ page }) => {
    await page.goto(userData.url.signIn);
    await LogInExistingUser(page, email);

    await page.goto(userData.url.usersList);
    const row = page.locator('table tbody tr', {
      hasText: `${updatedFirstName} ${updatedLastName}`,
    });
    const deleteBtn = row.getByRole('button', { name: userData.buttons.delete });
    await deleteBtn.click();

    await expect(page).toHaveURL(userData.url.usersList);
    await expect(page.locator(`text=${userData.messages.deleted}`)).toBeVisible();
    await expect(page.locator(`text=${updatedFirstName} ${updatedLastName}`)).not.toBeVisible();
  });
});
