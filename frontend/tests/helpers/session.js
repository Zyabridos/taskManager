import readFixture from './readFixture.js';
import { clickButtonByName } from './selectors.js';
import { faker } from '@faker-js/faker';

const sessionData = await readFixture('session.testData.json');

export const LogInExistingUser = async (page, email, password) => {
  await page.goto(sessionData.url.signIn);

  await page.getByLabel(sessionData.labels.email).fill(email ?? sessionData.user.email);
  await page.getByLabel(sessionData.labels.password).fill(password ?? sessionData.user.password);

  await clickButtonByName(page, sessionData.buttons.signIn);
};

export const signUpNewUser = async (
  page,
  email = faker.internet.email(),
  password = faker.internet.password(8),
  firstName = 'Name',
  lastName = 'Surname',
) => {
  const userData = await readFixture('users.testData.json');

  await page.goto(userData.url.signUp);

  await page.getByLabel(userData.labels.firstName).fill(firstName);
  await page.getByLabel(userData.labels.lastName).fill(lastName);
  await page.getByLabel(userData.labels.email).fill(email);
  await page.getByLabel(userData.labels.password).fill(password);

  await clickButtonByName(page, userData.buttons.signUp);

  return { email, password, firstName, lastName };
};

export const logOutUser = async page => {
  await clickButtonByName(page, sessionData.buttons.signOut);
};
