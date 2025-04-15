import { clickButtonByName } from './selectors';

export const setLanguage = async (page, lng) => {
  await page.evaluate(lng => localStorage.setItem('i18nextLng', lng), lng);
  await page.reload();
};

export const setUpLanguageViaUI = async (page, lng = 'en') => {
  clickButtonByName(page, lng);
};
