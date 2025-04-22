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

  console.log(`Logging in as ${email} (${lng})`);

  await page.goto(sessionUrls.signIn);
  await page.evaluate(lng => localStorage.setItem('i18nextLng', lng), lng);
  await page.reload();

  await page.getByLabel(sessionData.labels.email).fill(email);
  await page.getByLabel(sessionData.labels.password).fill(password);
  await clickButtonByName(page, sessionData.buttons.signIn);

  try {
    await page.waitForURL(url => url.pathname !== sessionUrls.signIn, { timeout: 5000 });
    console.log('URL changed after login:', await page.url());
  } catch (err) {
    console.error('❌❌❌❌❌❌ URL did not change after login');
    await page.screenshot({ path: 'frontend/test-results/login-failed.png', fullPage: true });
    throw new Error('❌❌❌❌❌❌Login failed: URL did not change');
  }
};

export const logOutUser = async (page, lng = 'en') => {
  await loadSessionData();
  const sessionData = sessionFixture[lng];
  await clickButtonByName(page, sessionData.buttons.signOut);
};
