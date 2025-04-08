import dotenv from 'dotenv';
import { prepareData, makeLogin } from './helpers/index.js';
import { setUpTestsEnv } from './helpers/setUpTestsEnv.js';

dotenv.config({ path: '.env.test' });

describe('test session', () => {
  let app;
  let testData;
  let cookie;

  beforeAll(async () => {
    ({ app } = await setUpTestsEnv());
    testData = await prepareData(app);
  });

  it('should log in a user', async () => {
    cookie = await makeLogin(app, testData.users.existing.author);
    expect(cookie).toBeDefined();
    expect(Object.keys(cookie).length).toBeGreaterThan(0);
  });

  it('should return the current session user', async () => {
    cookie = await makeLogin(app, testData.users.existing.author);

    const response = await app.inject({
      method: 'GET',
      url: '/api/session',
      // headers: {
      //   cookie: `session=${cookie.session}`,
      // },
      headers: {
  cookie,
}
    });

    expect(response.statusCode).toBe(200);

    const data = JSON.parse(response.body);
    expect(data.user.email).toBe(testData.users.existing.author.email);
  });

  it('should log out a user', async () => {
    cookie = await makeLogin(app, testData.users.existing.author);
    expect(cookie).toBeDefined();

    const response = await app.inject({
      method: 'DELETE',
      url: '/api/session',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
