import routes from '../../src/routes';
import { clickButtonByName } from './selectors.js';

const baseUrl = 'http://localhost:3000';
const password = 'qwerty';

// export const LogInExistingUser = async (page, email = 'example@example.com') => {
export const LogInExistingUser = async (page, email = 'example@example.com', password = 'qwerty') => {
  await page.goto(`${baseUrl}${routes.app.session.new()}`);

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Пароль').fill(password);
  await clickButtonByName(page, 'Войти');
};
