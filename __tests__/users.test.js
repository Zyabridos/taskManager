// @ts-check

import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/index.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData } from './helpers/index.js';

const routes = {
  root: '/',
  users: '/users',
  userNew: '/users/new',
  sessionNew: '/session/new',
  sessionCreate: '/session',
  sessionDelete: '/session/delete',
};

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    // knex = app.objection.knex;
    // models = app.objection.models;
    knex = app.objection.knex;
    models = app.objection.models;

    // TODO: пока один раз перед тестами
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    await prepareData(app);
  });

  beforeEach(async () => {});

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      // url: app.reverse('users'),
      url: routes.users,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      // url: app.reverse('newUser'),
      url: routes.userNew,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      // url: app.reverse('users'),
      url: routes.users,
      payload: {
        data: params,
      },
    });

    // 302 - code of redirect
    expect(response.statusCode).toBe(302);
    // just to be sure we redirect to /users
    expect(response.headers.location).toBe(routes.users);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  afterEach(async () => {
    // Пока Segmentation fault: 11
    // после каждого теста откатываем миграции
    // await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
