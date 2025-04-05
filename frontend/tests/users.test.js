import { test, expect } from '@playwright/test';
import { clickButtonByName } from './helpers/selectors.js';
import { LogInExistingUser } from './helpers/session.js';
import { faker } from '@faker-js/faker';
import readFixture from './helpers/readFixture.js';

const email = faker.internet.email();
const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const password = faker.internet.password(8);

const updatedFirstName = faker.person.firstName();
const updatedLastName = faker.person.lastName();
const updatedEmail = faker.internet.email();
const updatedPassword = faker.internet.password(8);

let userData;

test.beforeAll(async () => {
  userData = await readFixture('users.testData.json');
});

test.describe('users CRUD visual (UI)', () => {
  test('Should create new user from home page', async ({ page }) => {
    await page.goto(userData.url.root);
    await page.getByRole('link', { name: userData.links.signUp }).click();

    await page.getByLabel(userData.labels.firstName).fill(firstName);
    await page.getByLabel(userData.labels.lastName).fill(lastName);
    await page.getByLabel(userData.labels.email).fill(email);
    await page.getByLabel(userData.labels.password).fill(password);

    await page.getByRole('button', { name: userData.buttons.signUp }).click();

    await expect(page).toHaveURL(userData.url.usersList);
    await expect(page.locator(`text=${firstName} ${lastName}`)).toBeVisible();
    await expect(page.locator(`text=${userData.messages.signedUp}`)).toBeVisible();
  });

  test('Should show list of users', async ({ page }) => {
    await page.goto(userData.url.signIn);
    await LogInExistingUser(page, email, password);

    await page.goto(userData.url.usersList);
    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('Should NOT show delete button for other users', async ({ page }) => {
    const otherEmail = faker.internet.email();
    const otherFirstName = faker.person.firstName();
    const otherLastName = faker.person.lastName();
    const otherPassword = faker.internet.password(8);

    await page.goto(userData.url.root);
    await page.getByRole('link', { name: userData.links.signUp }).click();
    await page.getByLabel(userData.labels.firstName).fill(otherFirstName);
    await page.getByLabel(userData.labels.lastName).fill(otherLastName);
    await page.getByLabel(userData.labels.email).fill(otherEmail);
    await page.getByLabel(userData.labels.password).fill(otherPassword);
    await page.getByRole('button', { name: userData.buttons.signUp }).click();

    await page.goto(userData.url.signIn);
    await LogInExistingUser(page, updatedEmail, updatedPassword);

    await page.goto(userData.url.usersList);

    const row = page.locator(`[data-email="${otherEmail}"]`);
    await expect(row.getByRole('button', { name: userData.buttons.delete })).toHaveCount(0);
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

  test('Should allow user to edit themselves', async ({ page }) => {
    await page.goto(userData.url.signIn);
    await LogInExistingUser(page, email, password);

    await page.goto(userData.url.usersList);
    const row = page.locator(`[data-email="${email}"]`);
    const editButton = row.getByRole('button', { name: userData.buttons.edit });
    await editButton.click();

    await page.locator('#firstName').fill(updatedFirstName);
    await page.locator('#lastName').fill(updatedLastName);
    await page.locator('#email').fill(updatedEmail);
    await page.locator('#password').fill(updatedPassword);

    await clickButtonByName(page, userData.buttons.edit);
    await expect(page).toHaveURL(userData.url.usersList);
    await expect(page.locator(`text=${userData.messages.updated}`)).toBeVisible();
    await expect(page.locator(`text=${updatedFirstName}`)).toBeVisible();
  });

  test('Should redirect with toast when trying to access edit of another user', async ({
    page,
  }) => {
    const otherEmail = faker.internet.email();
    const otherFirstName = faker.person.firstName();
    const otherLastName = faker.person.lastName();
    const otherPassword = faker.internet.password(8);

    await page.goto(userData.url.root);
    await page.getByRole('link', { name: userData.links.signUp }).click();
    await page.getByLabel(userData.labels.firstName).fill(otherFirstName);
    await page.getByLabel(userData.labels.lastName).fill(otherLastName);
    await page.getByLabel(userData.labels.email).fill(otherEmail);
    await page.getByLabel(userData.labels.password).fill(otherPassword);
    await page.getByRole('button', { name: userData.buttons.signUp }).click();

    await page.goto(userData.url.signIn);
    await LogInExistingUser(page, updatedEmail, updatedPassword);

    await page.goto(userData.url.usersList);
    const row = page.locator(`table tbody tr`).filter({ hasText: otherEmail });
    const otherUserId = await row.getAttribute('data-id');

    await page.goto(`${userData.url.usersEditBase}/${otherUserId}`);

    await expect(page).toHaveURL(userData.url.usersList);
    await expect(page.locator(`text=${userData.errors.notOwner}`)).toBeVisible();
  });

  test('Should be able to delete itself', async ({ page }) => {
    await page.goto(userData.url.signIn);
    await LogInExistingUser(page, updatedEmail, updatedPassword);

    await page.goto(userData.url.usersList);
    const row = page.locator(`[data-email="${updatedEmail}"]`);
    const deleteBtn = row.getByRole('button', { name: userData.buttons.delete });
    await deleteBtn.click();

    await expect(page).toHaveURL(userData.url.usersList);
    await expect(page.locator(`text=${userData.messages.deleted}`)).toBeVisible();
    await expect(page.locator(`text=${updatedFirstName} ${updatedLastName}`)).not.toBeVisible();
  });
});
