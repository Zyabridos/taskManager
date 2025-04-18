import readFixture from './readFixture.js';
import { clickButtonByName } from './selectors.js';

let sessionFixture;
let sessionUrls;

const loadSessionData = async () => {
  if (!sessionFixture || !sessionUrls) {
    const { languages, url } = await readFixture('session.testData.json');
    sessionFixture = languages;
    sessionUrls = url;
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
