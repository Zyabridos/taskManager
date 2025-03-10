import fastify from "fastify";
import init from "../server/plugin/index.js";
import { prepareData, makeLogin } from "./helpers/index.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

describe("test session", () => {
  let app;
  let knex;
  let testData;
  let cookie;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: "pino-pretty" },
    });
    await init(app);
    knex = app.objection.knex; // инициализация knex`a
    await knex.migrate.latest(); // не забываем обновить миграции
    testData = await prepareData(app); // вставляем данные в БД
  });

  it("test makeLogin()", async () => {
    const cookie = await makeLogin(app, {
      email: testData.users.existing.author.email,
      password: testData.users.existing.author.password,
    });

    expect(cookie).toBeDefined();
    expect(Object.keys(cookie).length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await app.close();
  });

  it("test sign in / sign out", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/session/new",
    });

    expect(response.statusCode).toBe(200);

    // Логинимся с помощью makeLogin
    cookie = await makeLogin(app, {
      email: testData.users.existing.author.email,
      password: testData.users.existing.author.password,
    });

    expect(cookie).toBeDefined();

    const responseSignOut = await app.inject({
      method: "DELETE",
      url: "/session",
      cookies: cookie,
    });

    expect(responseSignOut.statusCode).toBe(302);
  });

  afterAll(async () => {
    await app.close();
  });
});

// npx jest __tests__/session.test.js
