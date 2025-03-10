import fastify from "fastify";
import init from "../server/plugin/index.js";
import { prepareData, makeLogin } from "./helpers/index.js";
import { expect } from "@jest/globals";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

describe("test tasks filtration by labels, status, and executor", () => {
  let app;
  let models;
  let knex;
  let testData;
  let cookie;
  let labels;
  let statuses;
  let executors;
  let selectedLabel;
  let selectedStatus;
  let selectedExecutor;
  let taskWithDataFromDB;

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

  beforeEach(async () => {
    labels = await models.label.query();
    statuses = await models.status.query();
    executors = await models.user.query();

    selectedLabel = labels[0];
    selectedStatus = statuses[0];
    selectedExecutor = executors[0];

    taskWithDataFromDB = await models.task.query().insert({
      name: "Task with correct data",
      description: "This task should appear in the filtered results",
      statusId: selectedStatus.id,
      authorId: 1,
      executorId: selectedExecutor.id,
    });

    await knex("task_labels").insert({
      task_id: taskWithDataFromDB.id,
      label_id: selectedLabel.id,
    });

    await models.task.query().insert({
      name: "Task with random data",
      description: "This task should NOT appear in the filtered results",
      statusId: selectedStatus.id + 1,
      authorId: 2,
      executorId: selectedExecutor.id + 1,
    });
  });

  it("should return only tasks with the selected label", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/tasks",
      query: { label: selectedLabel.id.toString() },
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
    expect(taskNames).toContain("Task with correct data");
    expect(taskNames).not.toContain("Task with random data");
  });

  it("should return only tasks with the selected status", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/tasks",
      query: { status: selectedStatus.id.toString() },
      cookies: cookie,
      headers: { Accept: "application/json" },
    });

    expect(response.statusCode).toBe(200);
    const jsonResponse = JSON.parse(response.body);

    jsonResponse.forEach((task) => {
      expect(task.statusId).toBe(selectedStatus.id);
    });

    const taskNames = jsonResponse.map((task) => task.name);
    expect(taskNames).toContain("Task with correct data");
    expect(taskNames).not.toContain("Task with random data");
  });

  it("should return only tasks with the selected executor", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/tasks",
      query: { executor: selectedExecutor.id.toString() },
      cookies: cookie,
      headers: { Accept: "application/json" },
    });

    expect(response.statusCode).toBe(200);
    const jsonResponse = JSON.parse(response.body);

    jsonResponse.forEach((task) => {
      expect(task.executorId).toBe(selectedExecutor.id);
    });

    const taskNames = jsonResponse.map((task) => task.name);
    expect(taskNames).toContain("Task with correct data");
    expect(taskNames).not.toContain("Task with random data");
  });

  it("should return only tasks with the all selected query params", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/tasks",
      query: {
        label: selectedLabel.id.toString(),
        status: selectedStatus.id.toString(),
        executor: selectedExecutor.id.toString(),
      },
      cookies: cookie,
      headers: { Accept: "application/json" },
    });

    expect(response.statusCode).toBe(200);
    const jsonResponse = JSON.parse(response.body);

    jsonResponse.forEach((task) => {
      const taskLabelIds = task.labels.map((label) => label.id);
      expect(taskLabelIds).toContain(selectedLabel.id);
      expect(task.statusId).toBe(selectedStatus.id);
      expect(task.executorId).toBe(selectedExecutor.id);
    });

    const taskNames = jsonResponse.map((task) => task.name);
    expect(taskNames).toContain("Task with correct data");
    expect(taskNames).not.toContain("Task with random data");
  });

  afterEach(async () => {
    await knex("tasks").del();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});

// npx jest __tests__/filter.test.js
