import fastify from "fastify";
import init from "../server/plugin/index.js";
import { prepareData, makeLogin } from "./helpers/index.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

describe("test statuses CRUD", () => {
  let app;
  let models;
  let knex;
  let testData;
  let cookie;

  beforeEach(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: "pino-pretty" },
    });

    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    await knex.migrate.latest();

    testData = await prepareData(app);
  });

  beforeEach(async () => {
    cookie = await makeLogin(app, testData.users.existing.author);
  });

  it("index", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/statuses",
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it("new", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/statuses/new",
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it("create", async () => {
    const params = testData.statuses.new;
    const response = await app.inject({
      method: "POST",
      url: "/statuses",
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const status = await models.status.query().findOne({ name: params.name });
    expect(status).toMatchObject(params);
  });

  it("delete", async () => {
    const params = testData.statuses.existing.delete;
    const statusToDelete = await models.status
      .query()
      .findOne({ name: params.name });
    const response = await app.inject({
      method: "DELETE",
      url: `/statuses/${statusToDelete.id}`,
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedStatus = await models.status
      .query()
      .findOne({ name: params.name });
    expect(deletedStatus).toBeUndefined();
  });

  it("should NOT be deleted when it has a task", async () => {
    const params = testData.statuses.existing.delete;
    const statusToDelete = await models.status
      .query()
      .findOne({ name: params.name });
    expect(statusToDelete).toBeDefined();

    const taskWithStatus = await models.task.query().insert({
      name: "Test task with status",
      description: "This task is linked to a status",
      statusId: statusToDelete.id,
      // NOTE:
      // consider finding user in DB instead of hardcore
      authorId: 1,
      executorId: 1,
    });

    expect(taskWithStatus).toBeDefined();

    const statusNotSupposedToBeDeleted = await models.status
      .query()
      .findOne({ name: params.name });
    expect(statusNotSupposedToBeDeleted).toBeDefined();
  });

  it("update", async () => {
    const params = testData.statuses.existing.update;
    const statusToDelete = await models.status
      .query()
      .findOne({ name: params.name });
    const updatedStatusName = "updated";
    const response = await app.inject({
      method: "PATCH",
      url: `/statuses/${statusToDelete.id}`,
      payload: {
        data: { name: updatedStatusName },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);

    const updatedStatus = await statusToDelete.$query();
    expect(updatedStatus.name).toEqual(updatedStatusName);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});

// npx jest __tests__/statuses.test.js
