import { test, expect } from '@playwright/test';
import { clickButtonByName } from './helpers/selectors.js';
import { LogInExistingUser, signUpNewUser } from './helpers/session.js';
import { faker } from '@faker-js/faker';
import readFixture from './helpers/readFixture.js';

let userData;

test.beforeAll(async () => {
  userData = await readFixture('users.testData.json');
});

test.describe('users UI layout and headers', () => {
  let email;
  let password;

  test.beforeEach(async ({ page }) => {
    const user = await signUpNewUser(page);
    email = user.email;
    password = user.password;
    await LogInExistingUser(page, email, password);
  });

  test('Should display correct page title and table headers', async ({ page }) => {
    await page.goto(userData.url.usersList);
    const { table } = userData;

    await expect(page.getByRole('heading', { name: table.pageTitle })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: table.columns.id })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: table.columns.fullName })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: table.columns.email })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: table.columns.createdAt })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: table.columns.actions })).toBeVisible();
  });

  test('Should show list of users', async ({ page }) => {
    await page.goto(userData.url.usersList);
    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0);
  });
});

test.describe('users edit/delete functionality', () => {
  let email, password, otherEmail;
  let updatedFirstName, updatedLastName, updatedEmail, updatedPassword;

  test.beforeEach(async ({ page }) => {
    const user = await signUpNewUser(page);
    email = user.email;
    password = user.password;
    await LogInExistingUser(page, email, password);

    otherEmail = faker.internet.email();
    const otherPassword = faker.internet.password();
    await page.goto(userData.url.signUp);
    await page.getByLabel(userData.labels.firstName).fill(faker.person.firstName());
    await page.getByLabel(userData.labels.lastName).fill(faker.person.lastName());
    await page.getByLabel(userData.labels.email).fill(otherEmail);
    await page.getByLabel(userData.labels.password).fill(otherPassword);
    await clickButtonByName(page, userData.buttons.signUp);

    updatedFirstName = faker.person.firstName();
    updatedLastName = faker.person.lastName();
    updatedEmail = faker.internet.email();
    updatedPassword = faker.internet.password();
  });

  test('Should show delete button only for current user', async ({ page }) => {
    await page.goto(userData.url.usersList);
    const deleteButtons = page.locator(
      `table tbody tr >> role=button[name="${userData.buttons.delete}"]`,
    );
    await expect(deleteButtons).toHaveCount(1);
  });

  test('Should allow user to edit themselves', async ({ page }) => {
    await page.goto(userData.url.usersList);
    const row = page.locator(`[data-email="${email}"]`);
    await row.getByRole('link', { name: userData.buttons.edit }).click();

    await page.locator('#firstName').fill(updatedFirstName);
    await page.locator('#lastName').fill(updatedLastName);
    await page.locator('#email').fill(updatedEmail);
    await page.locator('#password').fill(updatedPassword);

    await clickButtonByName(page, userData.buttons.edit);
    await expect(page).toHaveURL(userData.url.usersList);
    await expect(page.locator(`text=${userData.messages.updated}`)).toBeVisible();
  });

  test('Should be able to delete itself', async ({ page }) => {
    await page.goto(userData.url.usersList);
    const row = page.locator(`[data-email="${email}"]`);
    await row.getByRole('button', { name: userData.buttons.delete }).click();

    await expect(page).toHaveURL(userData.url.usersList);
    await expect(page.locator(`text=${userData.messages.deleted}`)).toBeVisible();
    await expect(page.locator(`[data-email="${email}"]`)).toHaveCount(0);
  });
});

test.describe('users access control', () => {
  let email, password, otherEmail;

  test.beforeEach(async ({ page }) => {
    const user = await signUpNewUser(page);
    email = user.email;
    password = user.password;
    await LogInExistingUser(page, email, password);

    otherEmail = faker.internet.email();
    const otherPassword = faker.internet.password();
    const otherFirstName = faker.person.firstName();
    const otherLastName = faker.person.lastName();

    await page.goto(userData.url.signUp);
    await page.getByLabel(userData.labels.firstName).fill(otherFirstName);
    await page.getByLabel(userData.labels.lastName).fill(otherLastName);
    await page.getByLabel(userData.labels.email).fill(otherEmail);
    await page.getByLabel(userData.labels.password).fill(otherPassword);
    await clickButtonByName(page, userData.buttons.signUp);
  });

  test('Should redirect with toast when trying to access edit of another user', async ({
    page,
  }) => {
    await page.goto(userData.url.usersList);
    const otherRow = page.locator(`[data-email="${otherEmail}"]`);
    const otherUserId = await otherRow.getAttribute('data-id');

    await page.goto(`${userData.url.usersList}/${otherUserId}/edit`);

    await expect(page).toHaveURL(userData.url.usersList);
    await expect(page.locator(`text=${userData.errors.notOwner}`)).toBeVisible();
  });
});
