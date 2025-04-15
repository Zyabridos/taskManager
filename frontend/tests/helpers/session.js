import readFixture from './readFixture.js';
import { clickButtonByName } from './selectors.js';
import { faker } from '@faker-js/faker';

let sessionFixture;
let sessionUrls;
let userFixture;
let userUrls;

const loadSessionData = async () => {
  if (!sessionFixture || !sessionUrls) {
    const { languages, url } = await readFixture('session.testData.json');
    sessionFixture = languages;
    sessionUrls = url;
  }
};

const loadUserData = async () => {
  if (!userFixture || !userUrls) {
    const { languages, url } = await readFixture('users.testData.json');
    userFixture = languages;
    userUrls = url;
  }
};

export const LogInExistingUser = async (page, email, password, lng = 'en') => {
  await loadSessionData();
  const sessionData = sessionFixture[lng];

  await page.goto(sessionUrls.signIn);
  await page.evaluate(lng => localStorage.setItem('i18nextLng', lng), lng);
  await page.reload();

  await page.getByLabel(sessionData.labels.email).fill(email);
  await page.getByLabel(sessionData.labels.password).fill(password);
  await clickButtonByName(page, sessionData.buttons.signIn);
};

export const signUpNewUser = async (page, lng = 'en') => {
  await loadUserData();
  const userData = userFixture[lng];

  const email = faker.internet.email();
  const password = 'qwerty';

  await page.goto(userUrls.signUp);
  await page.evaluate(lng => localStorage.setItem('i18nextLng', lng), lng);
  await page.reload();

  await page.getByLabel(userData.labels.firstName).fill('Name');
  await page.getByLabel(userData.labels.lastName).fill('Surname');
  await page.getByLabel(userData.labels.email).fill(email);
  await page.getByLabel(userData.labels.password).fill(password);
  await clickButtonByName(page, userData.buttons.signUp);

  return { email, password };
};

export const logOutUser = async (page, lng = 'en') => {
  await loadSessionData();
  const sessionData = sessionFixture[lng];
  await clickButtonByName(page, sessionData.buttons.signOut);
};

export const authAndGoToList = async (page, url, lng) => {
  const { email, password } = await signUpNewUser(page, lng);
  await LogInExistingUser(page, email, password, lng);
  await page.goto(url.list);
};
