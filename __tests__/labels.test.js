import { prepareData, makeLogin } from "./helpers/index.js";
import dotenv from "dotenv";
import request from "./helpers/request.js";
import { findEntity } from "./helpers/index.js"; // Универсальная функция поиска
import setUpTestsEnv from "./helpers/setUpTestsEnv.js";

dotenv.config({ path: ".env.test" });

describe("test labels CRUD", () => {
  let app;
  let models;
  let knex;
  let testData;
  let cookie;

  beforeEach(async () => {
    ({ app, knex, models } = await setUpTestsEnv());
    testData = await prepareData(app);
    cookie = await makeLogin(app, testData.users.existing.author);
  });

  it("should show a list of labels", async () => {
    const response = await request(app, "GET", "/labels", cookie);
    expect(response.statusCode).toBe(200);
  });

  it("should return new label creation page", async () => {
    const response = await request(app, "GET", "/labels/new", cookie);
    expect(response.statusCode).toBe(200);
  });

  it("should create a new label", async () => {
    const params = testData.labels.new;
    const response = await request(app, "POST", "/labels", cookie, params);
    expect(response.statusCode).toBe(302);

    const label = await findEntity(models.label, "name", params.name);
    expect(label).toMatchObject(params);
  });

  it("should delete a label", async () => {
    const params = testData.labels.existing.delete;
    const labelToDelete = await findEntity(models.label, "name", params.name);
    expect(labelToDelete).toBeDefined();

    const response = await request(
      app,
      "DELETE",
      `/labels/${labelToDelete.id}`,
      cookie,
    );
    expect(response.statusCode).toBe(302);

    const deletedLabel = await findEntity(models.label, "name", params.name);
    expect(deletedLabel).toBeUndefined();
  });

  it("should NOT delete a label if it's linked to a task", async () => {
    const params = testData.labels.existing.delete;
    const labelToDelete = await findEntity(models.label, "name", params.name);
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

    const response = await request(
      app,
      "DELETE",
      `/labels/${labelToDelete.id}`,
      cookie,
    );
    expect(response.statusCode).toBe(400);

    const stillExist
