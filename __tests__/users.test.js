import _ from "lodash";
import fastify from "fastify";
import init from "../server/plugin/index.js";
import encrypt from "../server/lib/secure.cjs";
import { getTestData, prepareData, makeLogin } from "./helpers/index.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

describe("test users CRUD", () => {
  let app;
  let models;
  let knex;
  const testData = getTestData();

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
    const response = await app.inject({
      method: "POST",
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
    expect(user).toMatchObject(expected);
  });

  it("delete", async () => {
    const params = testData.users.existing.fixed;
    const userToDelete = await models.user
      .query()
      .findOne({ email: params.email });

    const cookie = await makeLogin(app, testData.users.existing.fixed);
    const response = await app.inject({
      // удаляем
      method: "DELETE",
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

  it("should NOT be deleted when it has a task", async () => {
    const params = testData.users.existing.fixed;
    const userToDelete = await models.user
      .query()
      .findOne({ email: params.email });

    expect(userToDelete).toBeDefined();

    console.log("user to delete:, ", userToDelete);

    const taskWithUser = await models.task.query().insert({
      name: "Test task with user",
      description: "This task is linked to an user",
      statusId: 1,
      authorId: userToDelete.id,
      executorId: userToDelete.id,
    });

    expect(taskWithUser).toBeDefined();

    const userNotSupposedToBeDeleted = await models.user
      .query()
      .findOne({ email: params.email });
    expect(userNotSupposedToBeDeleted).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
    await knex.destroy();
  });
});
