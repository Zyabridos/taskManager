import { prepareData, makeLogin } from "./helpers/index.js";
import request from "./helpers/request.js";
import { findEntity } from "./helpers/index.js";
import dotenv from "dotenv";
import setUpTestsEnv from "./helpers/setUpTestsEnv.js";

dotenv.config({ path: ".env.test" });

describe("test tasks CRUD", () => {
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

  it("should return tasks list", async () => {
    const response = await request(app, "GET", "/tasks", cookie);
    expect(response.statusCode).toBe(200);
  });

  it("should return new task creation page", async () => {
    const response = await request(app, "GET", "/tasks/new", cookie);
    expect(response.statusCode).toBe(200);
  });

  it("should return a particular task", async () => {
    const params = testData.tasks.existing.update;
    const task = await findEntity(models.task, "name", params.name);
    expect(task).toBeDefined();

    const response = await request(app, "GET", `/tasks/${task.id}`, cookie);
    expect(response.statusCode).toBe(200);
  });

  it("should create a new task", async () => {
    const params = testData.tasks.new;
    const response = await request(app, "POST", "/tasks", cookie, params);
    expect(response.statusCode).toBe(302);

    const task = await findEntity(models.task, "name", params.name);
    expect(task).toMatchObject(params);
  });

  it("should delete a task", async () => {
    const params = testData.tasks.existing.delete;
    const taskToDelete = await findEntity(models.task, "name", params.name);
    expect(taskToDelete).toBeDefined();

    const response = await request(
      app,
      "DELETE",
      `/tasks/${taskToDelete.id}`,
      cookie,
    );
    expect(response.statusCode).toBe(302);

    const deletedTask = await findEntity(models.task, "name", params.name);
    expect(deletedTask).toBeUndefined();
  });

  it("should update a task", async () => {
    const params = testData.tasks.existing.update;
    const task = await findEntity(models.task, "name", params.name);
    expect(task).toBeDefined();

    const updatedTaskName = "Updated Task Name";
    const response = await request(app, "PATCH", `/tasks/${task.id}`, cookie, {
      ...params,
      name: updatedTaskName,
    });

    expect(response.statusCode).toBe(302);

    const updatedTask = await models.task.query().findById(task.id);
    expect(updatedTask.name).toEqual(updatedTaskName);
  });

  afterEach(async () => {
    await knex("tasks").del();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});
