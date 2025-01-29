import fastify from 'fastify';
import init from '../server/plugin/index.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test session', () => {
  let app;
  let knex;
  let testData;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex; // инициализация knex`a
    await knex.migrate.latest(); // не забываем обновить миграции
    await prepareData(app); // вставляем данные в БД
    testData = getTestData(); // загружаем зараннее подготовленные данные
  });

  it('test sign in / sign out', async () => {
    const response = await app.inject({
      method: 'GET',
      // url: app.reverse('newSession'), // возвращает путь маршрута на основе его имени
      // , но тк у нас проблемы с этой библиотекой, используем обычный путь:
      url: '/session/new',
    });

    expect(response.statusCode).toBe(200);

    const responseSignIn = await app.inject({
      method: 'POST', // пытаемся авторизоваться через метод POST
      // url: app.reverse('session'),
      url: '/session',
      payload: {
        data: testData.users.existing, // передаем данные авторизации из `testData.users.existing`.
      },
    });

    expect(responseSignIn.statusCode).toBe(302); // проверяем, что сервер отвечает статусом 302 (Redirect)
    // после успешной аутентификации получаем куки из ответа,
    // они понадобятся для выполнения запросов на маршруты требующие
    // предварительную аутентификацию
    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value }; // Формируем объект с именем и значением cookie для использования в последующих запросах.

    const responseSignOut = await app.inject({
      method: 'DELETE',
      // отправляем DELETE-запрос на маршрут для завершения сессии (выход из системы).
      url: '/session',
      // используем полученные ранее куки
      cookies: cookie,
    });

    expect(responseSignOut.statusCode).toBe(302);
  });

  afterAll(async () => {
    // await knex.migrate.rollback();
    await app.close();
  });
});
