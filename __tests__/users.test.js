import _ from "lodash";
import fastify from "fastify";
import init from "../server/plugin/index.js";
import encrypt from "../server/lib/secure.cjs";
import { getTestData, prepareData, makeLogin } from "./helpers/index.js";

describe("test users CRUD", () => {
  let app;
  let models;
  let knex;
  const testData = getTestData();

  // перед каждым тестом выполняем миграции
  // и заполняем БД тестовыми данными
  beforeEach(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: "pino-pretty" },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
    await knex.migrate.latest();
    await prepareData(app);
  });

  it("index", async () => {
    const response = await app.inject({
      method: "GET",
      url: app.reverse("users"),
    });

    expect(response.statusCode).toBe(200);
  });

  it("new", async () => {
    const response = await app.inject({
      method: "GET",
      url: app.reverse("newUser"),
    });

    expect(response.statusCode).toBe(200);
  });

  it("create", async () => {
    const params = testData.users.new;
    console.log("params for user creation: ", params);
    const response = await app.inject({
      method: "POST",
      // url: app.reverse('users'),
      url: "/users",
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, "password"),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    console.log("new user in create test: ", user);
    expect(user).toMatchObject(expected);
  });

  it("delete", async () => {
    // const params = testData.users.existing.delete; - находит рандомного человека, которого нет в БД
    const params = testData.users.existing.fixed;
    console.log("params for user deleting: ", params);
    const userToDelete = await models.user
      .query()
      .findOne({ email: params.email });

    console.log("got a user:,", userToDelete);

    const cookie = await makeLogin(app, testData.users.existing.fixed);
    const response = await app.inject({
      method: "DELETE",
      // url: app.reverse('deleteUser', { id: userToDelete.id }),
      url: `/users/${userToDelete.id}`,
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    console.log("Response status:", response.statusCode);
    expect(response.statusCode).toBe(302);
    expect(
      await models.user.query().findOne({ email: params.email }),
    ).toBeUndefined();
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
