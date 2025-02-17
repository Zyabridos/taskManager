import _ from "lodash";
import fastify from "fastify";
import init from "../server/plugin/index.js";
import encrypt from "../server/lib/secure.cjs";
import { getTestData, prepareData, makeLogin } from "./helpers/index.js";

describe("test users CRUD", () => {
  let app;
  let models;
  let knex;
  const testData = getTestData(); // тестовые данные

  beforeEach(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: "pino-pretty" },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
    await knex.migrate.latest(); // принимаем последние миграции
    await prepareData(app); // и заполняем БД тестовыми данными
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
      ..._.omit(params, "password"), // отбрасываем пароль так как он захэширован
      passwordDigest: encrypt(params.password), // encrypt(params.password) — проверяем, что пароль действительно захеширован.
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it("delete", async () => {
    const params = testData.users.existing.fixed;
    const userToDelete = await models.user
      .query()
      .findOne({ email: params.email });

    const cookie = await makeLogin(app, testData.users.existing.fixed); // логинимся
    const response = await app.inject({
      // удаляем
      method: "DELETE",
      // url: app.reverse('deleteUser', { id: userToDelete.id }),
      url: `/users/${userToDelete.id}`,
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    expect(
      await models.user.query().findOne({ email: params.email }),
    ).toBeUndefined();
  });

  it("update", async () => {
    const params = testData.users.existing.fixed;
    const user = await models.user.query().findOne({ email: params.email });
    const newLastName = "Golovach";

    const cookie = await makeLogin(app, testData.users.existing.fixed);
    const response = await app.inject({
      method: "PATCH",
      url: `/users/${user.id}`,
      // url: app.reverse('updateUser', { id: user.id }),
      payload: {
        data: {
          ...params,
          lastName: newLastName,
        },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const updatedUser = await user.$query();
    expect(updatedUser.lastName).toEqual(newLastName);
  });

  afterAll(async () => {
    await app.close();
    await knex.destroy();
  });
});
