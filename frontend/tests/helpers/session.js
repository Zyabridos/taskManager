import readFixture from './readFixture.js';
import { clickButtonByName } from './selectors.js';
import { faker } from '@faker-js/faker';

const sessionData = await readFixture('session.testData.json');

export const LogInExistingUser = async (
  page,
  email = sessionData.user.email,
  password = sessionData.user.password,
) => {
  await page.goto(sessionData.url.signIn);

  await page.getByLabel(sessionData.labels.email).fill(email);
  await page.getByLabel(sessionData.labels.password).fill(password);

  await clickButtonByName(page, sessionData.buttons.signIn);
};

export const signUpNewUser = async (page, lng = 'en') => {
  const userData = await readFixture('users.testData.json');
  const email = `${Date.now()}@test.com`;
  const password = 'qwerty';
  const firstName = 'Name';
  const lastName = 'Surname';

  await page.goto(userData.url.signUp);
  await page.evaluate(lng => {
    localStorage.setItem('i18nextLng', lng);
  }, lng);

  await page.goto(userData.url.signUp);
  await page.getByLabel(userData.labels.firstName).fill(firstName);
  await page.getByLabel(userData.labels.lastName).fill(lastName);
  await page.getByLabel(userData.labels.email).fill(email);
  await page.getByLabel(userData.labels.password).fill(password);

  await clickButtonByName(page, userData.buttons.signUp);

  return { email, password };
};

export const logOutUser = async page => {
  await clickButtonByName(page, sessionData.buttons.signOut);
};
