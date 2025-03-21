import { prepareData, makeLogin } from './helpers/index.js';
import { setUpTestsEnv } from './helpers/setUpTestsEnv.js';

describe('makeLogin function', () => {
  let app;
  let knex;
  let models;
  let testData;

  beforeAll(async () => {
    ({ app, knex, models } = await setUpTestsEnv());
    testData = await prepareData(app);
  });

  afterAll(async () => {
    await knex.destroy();
    await app.close();
  });

  it('should return a valid session cookie', async () => {
    const userData = testData.users.existing.author;
    const sessionCookie = await makeLogin(app, userData);

    expect(sessionCookie).toBeDefined();
    expect(typeof sessionCookie).toBe('object');

    const cookieKeys = Object.keys(sessionCookie);
    expect(cookieKeys.length).toBe(1);
    expect(cookieKeys[0]).toBe('session');

    const cookieValue = sessionCookie.session;
    expect(typeof cookieValue).toBe('string');
    expect(cookieValue.length).toBeGreaterThan(10);
  });

  it('should return 401 for wrong password', async () => {
    const existingUser = testData.users.existing.author;
    const wrongPasswordData = {
      email: existingUser.email,
      password: 'wrongpassword',
    };

    const responseSignIn = await app.inject({
      method: 'POST',
      url: '/session',
      payload: { data: wrongPasswordData },
    });

    expect(responseSignIn.statusCode).toBe(401);
  });

  it('should set a valid session cookie after login', async () => {
    const userData = testData.users.existing.author;
    const responseSignIn = await app.inject({
      method: 'POST',
      url: '/session',
      payload: { data: userData },
    });

    expect(responseSignIn.statusCode).toBe(302);

    const setCookieHeader = responseSignIn.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    expect(
      setCookieHeader.some((cookie) => cookie.startsWith('session='))
    ).toBe(true);
  });
});
