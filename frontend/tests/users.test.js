import { test, expect } from '@playwright/test';
import { clickButtonByName } from './helpers/selectors.js';
import { LogInExistingUser, signUpNewUser, logOutUser } from './helpers/session.js';
import { faker } from '@faker-js/faker';
import readFixture from './helpers/readFixture.js';

const updatedFirstName = faker.person.firstName();
const updatedLastName = faker.person.lastName();
const updatedEmail = faker.internet.email();
const updatedPassword = faker.internet.password(8);

let userData;
let email;
let password;

test.beforeAll(async () => {
  userData = await readFixture('users.testData.json');
  ({ email, password } = userData.existing);
});

test.describe('users CRUD visual (UI)', () => {
  test('Should show list of users', async ({ page }) => {
    await page.goto(userData.url.signIn);

    await LogInExistingUser(page, email, password);

    await page.goto(userData.url.usersList);
    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('Should show delete button only for current user', async ({ page }) => {
    const otherEmail = faker.internet.email();
    const otherPassword = faker.internet.password(8);
    const otherFirstName = 'Other';
    const otherLastName = 'User';
    await signUpNewUser(page, otherEmail, otherPassword, otherFirstName, otherLastName);

    const {
      email: currentEmail,
      password: currentPassword,
      firstName,
      lastName,
    } = await signUpNewUser(page);

    await page.goto(userData.url.signIn);
    await LogInExistingUser(page, currentEmail, currentPassword);

    await page.goto(userData.url.usersList);

    const currentRow = page.locator(`[data-email="${currentEmail}"]`);
    await expect(currentRow.getByRole('button', { name: userData.buttons.delete })).toBeVisible();

    const otherRow = page.locator(`[data-email="${otherEmail}"]`);
    await expect(otherRow.getByRole('button', { name: userData.buttons.delete })).toHaveCount(0);
  });

  test('Should show error if email already in use', async ({ page }) => {
    signUpNewUser(page, email, password);

    await expect(page).toHaveURL(userData.url.signUp);
    await expect(page.locator(`text=${userData.errors.emailExists}`)).toBeVisible();
  });

  test('Should allow user to edit themselves', async ({ page }) => {
    const { email: newUserEmail, password: newUserPassword } = await signUpNewUser(page);

    await page.goto(userData.url.signIn);
    await LogInExistingUser(page, newUserEmail, newUserPassword);

    await page.goto(userData.url.usersList);

    const row = page.locator(`[data-email="${newUserEmail}"]`);
    const editButton = row.getByRole('link', { name: userData.buttons.edit });
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

  // test('Should redirect with toast when trying to access edit of another user', async ({
  //   page,
  // }) => {
  //   const otherEmail = faker.internet.email();
  //   const otherFirstName = faker.person.firstName();
  //   const otherLastName = faker.person.lastName();
  //   const otherPassword = faker.internet.password(8);

  //   await page.goto(userData.url.root);
  //   await page.getByRole('link', { name: userData.links.signUp }).click();
  //   await page.getByLabel(userData.labels.firstName).fill(otherFirstName);
  //   await page.getByLabel(userData.labels.lastName).fill(otherLastName);
  //   await page.getByLabel(userData.labels.email).fill(otherEmail);
  //   await page.getByLabel(userData.labels.password).fill(otherPassword);
  //   await page.getByRole('button', { name: userData.buttons.signUp }).click();

  //   await page.goto(userData.url.signIn);
  //   await LogInExistingUser(page, email, password);

  //   console.log('logged in with', email, password);
  //   await page.goto(userData.url.usersList);
  //   const row = page.locator(`table tbody tr`).filter({ hasText: otherEmail });
  //   // const otherUserId = await row.getAttribute('data-id');

  //   console.log(`going to : ${userData.url.usersList}/1/edit`);
  //   await page.goto(`${userData.url.usersList}/1/edit`);

  //   // await expect(page).toHaveURL(userData.url.usersList);
  //   await expect(page.locator(`text=${userData.errors.notOwner}`)).toBeVisible();
  // });

  test('Should be able to delete itself', async ({ page }) => {
    const {
      email: newUserEmail,
      password: newUserPassword,
      firstName,
      lastName,
    } = await signUpNewUser(page);

    await page.goto(userData.url.signIn);
    await LogInExistingUser(page, newUserEmail, newUserPassword);

    await page.goto(userData.url.usersList);

    const row = page.locator(`[data-email="${newUserEmail}"]`);

    const deleteBtn = row.getByRole('button', { name: userData.buttons.delete });
    await deleteBtn.click();

    await expect(page).toHaveURL(userData.url.usersList);
    await expect(page.locator(`text=${userData.messages.deleted}`)).toBeVisible();

    await expect(page.locator(`[data-email="${newUserEmail}"]`)).toHaveCount(0);
  });
});
