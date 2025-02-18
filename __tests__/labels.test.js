// @ts-check

import fastify from "fastify";

import init from "../server/plugin/index.js";
import { prepareData, makeLogin } from "./helpers/index.js";

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
      // url: app.reverse('labels'),
      url: "/labels",
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it("new", async () => {
    const response = await app.inject({
      method: "GET",
      // url: app.reverse('newLabel'),
      url: "/labels/new",
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it("create", async () => {
    const params = testData.labels.new;
    const response = await app.inject({
      method: "POST",
      // url: app.reverse('labels'),
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
      // url: app.reverse('deleteStatus', { id: status.id }),
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

  // work under progress
  it("should NOT be deleted when it has a task", async () => {
    // get a label to delete
    const params = testData.labels.existing.delete;
    const labelToDelete = await models.label
      .query()
      .findOne({ name: params.name });

    // check that the label exists
    expect(labelToDelete).toBeDefined();

    // TODO: move to fixtures
    const taskWithLabel = await models.task.query().insert({
      name: "Test Task with Label",
      description: "This task has a label",
      statusId: testData.statuses.seeds[0].id,
      authorId: testData.users.seeds[0].id,
      executorId: testData.users.seeds[1].id,
    });

    // Bond the task with the label
    await knex("task_labels").insert({
      task_id: taskWithLabel.id,
      label_id: labelToDelete.id,
    });

    const response = await app.inject({
      method: "DELETE",
      url: `/labels/${labelToDelete.id}`,
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).not.toBe(302); // should not redirect

    const deletedLabel = await models.label
      .query()
      .findOne({ name: params.name });
    expect(deletedLabel).toBeDefined(); // check that it is still in the database
  });

  it("update", async () => {
    const params = testData.labels.existing.update;
    const labelToDelete = await models.label
      .query()
      .findOne({ name: params.name });
    const updatedLabelName = "updated";
    const response = await app.inject({
      method: "PATCH",
      // url: app.reverse('updateLabel', { id: labelToDelete.id }),
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
    await knex.destroy(); // close knex connection
    await app.close();
  });
});

// npx jest __tests__/labels.test.js
