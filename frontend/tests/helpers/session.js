import routes from '../../src/routes';
import { clickButtonByName } from './selectors.js';
import readFixture from './readFixture.js';

const userData = await readFixture('users.testData.json');
const baseUrl = 'http://localhost:3000';

export const LogInExistingUser = async (
  page,
  email = 'example@example.com',
  password = 'qwerty',
) => {
  await page.goto(`${baseUrl}${routes.app.session.new()}`);

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Пароль').fill(password);
  await clickButtonByName(page, 'Войти');
};

export const signUpNewUser = async (
  page,
  email,
  password,
  firstName = 'Name',
  lastName = 'Surname',
) => {
  await page.goto(userData.url.signUp);

  await page.getByLabel(userData.labels.firstName).fill(firstName);
  await page.getByLabel(userData.labels.lastName).fill(lastName);
  await page.getByLabel(userData.labels.email).fill(email);
  await page.getByLabel(userData.labels.password).fill(password);

  await page.getByRole('button', { name: userData.buttons.signUp }).click();
};

export const logOutUser = async page => {
  clickButtonByName(page, 'Выход');
};
