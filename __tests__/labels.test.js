import fastify from "fastify";

import init from "../server/plugin/index.js";
import { prepareData, makeLogin } from "./helpers/index.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

describe("test labels CRUD", () => {
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
      url: "/labels",
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it("new", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/labels/new",
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it("create", async () => {
    const params = testData.labels.new;
    const response = await app.inject({
      method: "POST",
      url: "/labels",
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const label = await models.label.query().findOne({ name: params.name });
    expect(label).toMatchObject(params);
  });

  it("delete", async () => {
    const params = testData.labels.existing.delete;
    const labelToDelete = await models.label
      .query()
      .findOne({ name: params.name });

    const response = await app.inject({
      method: "DELETE",
      url: `/labels/${labelToDelete.id}`,
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedLabel = await models.label
      .query()
      .findOne({ name: params.name });
    expect(deletedLabel).toBeUndefined();
  });

  it("should NOT be deleted when it has a task", async () => {
    const params = testData.labels.existing.delete;
    const labelToDelete = await models.label
      .query()
      .findOne({ name: params.name });

    expect(labelToDelete).toBeDefined();

    const taskWithLabel = await models.task.query().insert({
      name: "Test Task with Label",
      description: "This task has a label",
      statusId: 1,
      authorId: 1,
      executorId: 1,
    });

    await knex("task_labels").insert({
      task_id: taskWithLabel.id,
      label_id: labelToDelete.id,
    });

    const labelNotSupposedToBeDeleted = await models.label
      .query()
      .findOne({ name: params.name });
    expect(labelNotSupposedToBeDeleted).toBeDefined();
  });

  it("update", async () => {
    const params = testData.labels.existing.update;
    const labelToDelete = await models.label
      .query()
      .findOne({ name: params.name });
    const updatedLabelName = "updated";
    const response = await app.inject({
      method: "PATCH",
      url: `/labels/${labelToDelete.id}`,
      payload: {
        data: { name: updatedLabelName },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);

    const updatedLabel = await labelToDelete.$query();
    expect(updatedLabel.name).toEqual(updatedLabelName);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await knex.destroy();
    await app.close();
  });
});
