import _ from 'lodash';
import fastify from 'fastify';
import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData } from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  let testData;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    // Выполняем миграции и наполняем тестовыми данными
    await knex.migrate.latest();
    await prepareData(app);
    testData = getTestData();
  });

  beforeEach(async () => {
    // В случае необходимости можно добавить дополнительную логику перед каждым тестом
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      // url: app.reverse('users'),
      url: '/users',
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      // url: app.reverse('newUser'),
      url: `/users/new`,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302); // Проверяем, что сервер отвечает статусом 302 (Redirect)

    const expected = {
      ..._.omit(params, 'password'), // Ожидаем объект без пароля
      passwordDigest: encrypt(params.password), // Ожидаем зашифрованный пароль
    };

    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected); // Проверяем, что пользователь в базе соответствует ожиданиям
  });

  it('update', async () => {
    const params = testData.users.update;

    // Находим существующего пользователя по oldEmail
    const existingUser = await models.user
      .query()
      .findOne({ email: params.oldEmail });
    expect(existingUser).not.toBeNull(); // Убедитесь, что пользователь найден

    const response = await app.inject({
      method: 'PATCH',
      url: `/users/${existingUser.id}`, // Используем id существующего пользователя
      payload: {
        data: _.omit(params, 'oldEmail'), // Передаем новые данные для обновления
      },
    });

    expect(response.statusCode).toBe(302); // Ожидаем успешный редирект

    // Проверяем, что данные обновились
    const updatedUser = await models.user.query().findById(existingUser.id);
    expect(updatedUser).toMatchObject(_.omit(params, 'oldEmail'));
  });

  it('delete', async () => {
    const params = testData.users.delete;
    const userToDelete = await models.user
      .query()
      .findOne({ email: params.email });

    const response = await app.inject({
      method: 'DELETE',
      // url: app.reverse('deleteUser', { id: userToDelete.id }),
      url: `/users/${userToDelete.id}`,
    });

    expect(response.statusCode).toBe(302);

    const deletedUser = await models.user.query().findById(userToDelete.id);
    expect(deletedUser).toBeUndefined();
  });

  afterEach(async () => {
    // Логика каждого теста откатываем миграции
    // await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
