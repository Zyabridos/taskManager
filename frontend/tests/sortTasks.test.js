import { test, expect } from '@playwright/test';
import readFixture from './helpers/readFixture.js';
import { LogInExistingUser, signUpNewUser } from './helpers/session.js';
import { clickButtonByName, clickLinkByName } from './helpers/selectors.js';
import { setLanguage } from './helpers/languageSetup.js';

let taskUrl;
let tasksLanguages;

test.beforeAll(async () => {
  const raw = await readFixture('tasks.testData.json');
  taskUrl = raw.url;
  tasksLanguages = {
    ru: raw.languages.ru,
    en: raw.languages.en,
    no: raw.languages.no,
  };
});

const languages = ['ru', 'en', 'no'];

languages.forEach((lng) => {
  test.describe(`${lng.toUpperCase()} | Tasks sorting`, () => {
    let data;
    let email;
    let password;

    test.beforeAll(() => {
      data = tasksLanguages[lng];
    });

    test.beforeEach(async ({ page }) => {
      const user = await signUpNewUser(page, lng);
      email = user.email;
      password = user.password;

      await LogInExistingUser(page, email, password);

      // executors
      for (let i = 1; i <= 5; i++) {
        await signUpNewUser(page, lng, { firstName: `User${i}` });
      }

      // statuses
      await page.goto(taskUrl.statuses);
      for (let i = 1; i <= 5; i++) {
        await clickLinkByName(page, data.buttons.createStatus);
        await page.getByLabel(data.labels.name).fill(`Status ${i}`);
        await clickButtonByName(page, data.buttons.createStatus);
      }

      // label
      await page.goto(taskUrl.labels);
      await clickLinkByName(page, data.buttons.createLabel);
      await page.getByLabel(data.labels.name).fill('Frontend');
      await clickButtonByName(page, data.buttons.createLabel);

      // tasks
      for (let i = 1; i <= 5; i++) {
        await page.goto(taskUrl.create);
        await page.getByLabel(data.labels.name).fill(`Task ${i}`);
        await page.getByLabel(data.labels.status).selectOption({ label: `Status ${i}` });
        await page.getByLabel(data.labels.label).selectOption({ label: 'Frontend' });
        await page.getByLabel(data.labels.executor).selectOption({ label: `User${i} User${i}` });
        await clickButtonByName(page, data.buttons.create);
        await expect(page).toHaveURL(taskUrl.list);
      }

      await page.goto(taskUrl.list);
    });

    test('should sort by ID asc and desc', async ({ page }) => {
      await setLanguage(page, lng);
      const getFirstId = async () =>
        Number(await page.locator('tbody tr').first().getAttribute('data-id'));

      await page.locator('thead tr th', { hasText: data.table.columns.id }).click();
      const idDesc = await getFirstId();

      await page.locator('thead tr th', { hasText: data.table.columns.id }).click();
      const idAsc = await getFirstId();

      expect(idDesc).toBeGreaterThan(idAsc);
    });

    test('should sort by name asc and desc', async ({ page }) => {
      await setLanguage(page, lng);
      const getFirstName = async () =>
        await page.locator('tbody tr td').nth(1).textContent();

      await page.locator('thead tr th', { hasText: data.table.columns.name }).click();
      const asc = await getFirstName();

      await page.locator('thead tr th', { hasText: data.table.columns.name }).click();
      const desc = await getFirstName();

      expect(asc).not.toEqual(desc);
    });

    test('should sort by status asc and desc', async ({ page }) => {
      await setLanguage(page, lng);
      const getFirstStatus = async () =>
        await page.locator('tbody tr td').nth(2).textContent();

      await page.locator('thead tr th', { hasText: data.table.columns.status }).click();
      const asc = await getFirstStatus();

      await page.locator('thead tr th', { hasText: data.table.columns.status }).click();
      const desc = await getFirstStatus();

      expect(asc).not.toEqual(desc);
    });

    test('should sort by executor first name asc and desc', async ({ page }) => {
      await setLanguage(page, lng);
      const getFirstExecutor = async () =>
        await page.locator('tbody tr').first().getAttribute('data-executor');

      await page.locator('thead tr th', { hasText: data.table.columns.executor }).click();
      const asc = await getFirstExecutor();

      await page.locator('thead tr th', { hasText: data.table.columns.executor }).click();
      const desc = await getFirstExecutor();

      expect(asc).not.toEqual(desc);
    });

    test('should sort by createdAt asc and desc', async ({ page }) => {
      await setLanguage(page, lng);
      const getFirstDate = async () =>
        await page.locator('tbody tr').first().getAttribute('data-created-at');

      await page.locator('thead tr th', { hasText: data.table.columns.createdAt }).click();
      const asc = await getFirstDate();

      await page.locator('thead tr th', { hasText: data.table.columns.createdAt }).click();
      const desc = await getFirstDate();

      expect(asc).not.toEqual(desc);
    });
  });
});
