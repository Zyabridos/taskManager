import routes from '../../src/routes';
import { clickButtonByName } from './selectors.js';

const baseUrl = 'http://localhost:3000';
const email = 'example@example.com';
const password = 'qwerty';

export const LogInExistingUser = async page => {
  await page.goto(`${baseUrl}${routes.app.session.new()}`);

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Пароль').fill(password);
  await clickButtonByName(page, 'Войти');
};
