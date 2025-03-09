// @ts-check

import fastify from "fastify";

import init from "../server/plugin/index.js";
import { prepareData, makeLogin } from "./helpers/index.js";
import { expect } from "@jest/globals";

describe("test tasks filtration by labels", () => {
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

  it("should return only tasks with the selected label", async () => {
  // get existing labels
  const labels = await models.label.query();
  const selectedLabel = labels[0];

  // create
  const taskWithLabel = await models.task.query().insert({
    name: "Task with Label",
    description: "This task has a label",
    statusId: 1,
    authorId: 1,
    executorId: 1,
  });

  // make labels connected to the tasks
  await knex("task_labels").insert({
    task_id: taskWithLabel.id,
    label_id: selectedLabel.id,
  });

  const taskWithoutLabel = await models.task.query().insert({
    name: "Task Without Label",
    description: "This task should not appear in the filtered results",
    statusId: 1,
    authorId: 1,
    executorId: 1,
  });

  // make filtration request
  const response = await app.inject({
    method: "GET",
    url: "/tasks",
    query: { label: selectedLabel.id }, // filter by label
    cookies: cookie,
    headers: { Accept: "application/json" },
  });

  expect(response.statusCode).toBe(200);

  const jsonResponse = JSON.parse(response.body);

  jsonResponse.forEach((task) => {
    const taskLabelIds = task.labels.map((label) => label.id);
    expect(taskLabelIds).toContain(selectedLabel.id);
  });

  const taskNames = jsonResponse.map((task) => task.name);
  expect(taskNames).not.toContain("Task Without Label");
});

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    console.log("Closing database connection...");
    await knex.destroy();
    console.log("Closing Fastify server...");
    await app.close();
  });
});

// npx jest __tests__/filter.test.js