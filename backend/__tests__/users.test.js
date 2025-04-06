import dotenv from 'dotenv';
import _ from 'lodash';
import encrypt from '../server/lib/secure.cjs';
import { makeLogin } from './helpers/index.js';
import { setStandardBeforeEach } from './helpers/setUpTestsEnv.js';

dotenv.config({ path: '.env.test' });

describe('test users CRUD (API)', () => {
  let app;
  let models;
  let knex;
  let testData;
  let cookie;

  const getTestContext = setStandardBeforeEach();
  beforeEach(() => {
    ({ app, knex, models, testData, cookie } = getTestContext());
  });

  it('should show a list of users', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/users',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
    const users = JSON.parse(response.body);
    expect(Array.isArray(users)).toBe(true);
  });

  it('should create a new user', async () => {
    const params = testData.users.new;

    const response = await app.inject({
      method: 'POST',
      url: '/api/users',
      payload: params,
    });

    expect(response.statusCode).toBe(201);

    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };

    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('user should be able to update itself', async () => {
    const params = testData.users.existing.fixed;
    const user = await models.user.query().findOne({ email: params.email });
    const newLastName = 'Golovach';

    cookie = await makeLogin(app, params);

    const response = await app.inject({
      method: 'PATCH',
      url: `/api/users/${user.id}`,
      cookies: cookie,
      payload: { ...params, lastName: newLastName },
    });

    expect(response.statusCode).toBe(200);

    const updatedUser = await models.user.query().findById(user.id);
    expect(updatedUser.lastName).toBe(newLastName);
  });

  it('user should NOT be able to get to page to edit another user', async () => {
    const params = testData.users.existing.fixed;
    const user = await models.user.query().findOne({ email: params.email });

    cookie = await makeLogin(app, params);

    const response = await app.inject({
      method: 'PATCH',
      url: `/api/users/${user.id}`,
      cookies: cookie,
      payload: { ...params, lastName: newLastName },
    });

    expect(response.statusCode).toBe(422);
  });

  it('user should be able to delete itself', async () => {
    const params = testData.users.existing.fixed;
    const user = await models.user.query().findOne({ email: params.email });

    cookie = await makeLogin(app, params);

    const response = await app.inject({
      method: 'DELETE',
      url: `/api/users/${user.id}`,
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
    expect(await models.user.query().findById(user.id)).toBeUndefined();
  });

  it('should NOT delete user with related tasks', async () => {
    const params = testData.users.existing.fixed;
    const user = await models.user.query().findOne({ email: params.email });

    cookie = await makeLogin(app, params);

    await models.task.query().insert({
      name: 'Test task with user',
      description: 'This task is linked to a user',
      statusId: 1,
      authorId: user.id,
      executorId: user.id,
    });

    const response = await app.inject({
      method: 'DELETE',
      url: `/api/users/${user.id}`,
      cookies: cookie,
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toMatch(/related tasks/i);

    const stillExists = await models.user.query().findById(user.id);
    expect(stillExists).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
    await knex.destroy();
  });
});
