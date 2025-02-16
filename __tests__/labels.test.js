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
  console.log("test data: ", testData);

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
    console.log(
      "email of author of a status: ",
      testData.users.existing.author.email,
    );
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

  // work under progress
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

  // work under progress
  it("delete", async () => {
    const params = testData.labels.existing.delete;
    console.log("params for label to delete: ", params);
    const labelToDelete = await models.label
      .query()
      .findOne({ name: params.name });

    console.log("label to delete", labelToDelete);
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
  // it("should not be deleted when it has a task", async () => {
  //   const params = testData.labels.existing.delete;
  //   const labelToDelete = await models.label
  //     .query()
  //     .findOne({ name: params.name });
  //   const response = await app.inject({
  //     method: "DELETE",
  //     // url: app.reverse('deleteStatus', { id: status.id }),
  //     url: `/labels/${labelToDelete.id}`,
  //     payload: {
  //       data: params,
  //     },
  //     cookies: cookie,
  //   });

  //   expect(response.statusCode).toBe(302);
  //   const deletedLabel = await models.label
  //     .query()
  //     .findOne({ name: params.name });
  //   expect(deletedLabel).toBeUndefined();
  // });

  // work under progress
  // it("update", async () => {
  //   const params = testData.labels.existing.update;
  //   const labelToDelete = await models.label
  //     .query()
  //     .findOne({ name: params.name });
  //   const updatedLabelName = "updated";
  //   const response = await app.inject({
  //     method: "PATCH",
  //     // url: app.reverse('updateLabel', { id: labelToDelete.id }),
  //     url: `/labels/${labelToDelete.id}`,
  //     payload: {
  //       data: { name: updatedLabelName },
  //     },
  //     cookies: cookie,
  //   });

  //   expect(response.statusCode).toBe(302);

  //   const updatedLabel = await labelToDelete.$query();
  //   expect(updatedLabel.name).toEqual(updatedLabel);
  // });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await knex.destroy(); // закрыть соединение с БД
    await app.close();
  });
});

// npx jest __tests__/labels.test.js
