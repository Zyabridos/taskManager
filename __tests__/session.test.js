import dotenv from 'dotenv';
import { prepareData, makeLogin } from './helpers/index.js';
import { checkResponseCode } from './helpers/utils.js';
import setUpTestsEnv from './helpers/setUpTestsEnv.js';

dotenv.config({ path: '.env.test' });

describe('test session', () => {
  let app;
  let testData;
  let cookie;
  let knex;

  beforeAll(async () => {
    ({ app, knex } = await setUpTestsEnv());
    testData = await prepareData(app);
  });

  it('should return the login page', async () => {
    await checkResponseCode(app, 'GET', '/session/new');
  });

  it('should log in a user', async () => {
    cookie = await makeLogin(app, testData.users.existing.author);
    expect(cookie).toBeDefined();
    expect(Object.keys(cookie).length).toBeGreaterThan(0);
  });

  it('should log out a user', async () => {
    cookie = await makeLogin(app, testData.users.existing.author);
    expect(cookie).toBeDefined();

    await checkResponseCode(app, 'DELETE', '/session', cookie, null, 302);
  });

  afterAll(async () => {
    await app.close();
  });
});
