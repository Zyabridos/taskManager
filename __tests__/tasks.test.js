import fastify from "fastify";
import init from "../server/plugin/index.js";
import { prepareData, makeLogin } from "./helpers/index.js";
import request from "./helpers/request.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

describe("test tasks CRUD", () => {
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
    cookie = await makeLogin(app, testData.users.existing.author);
  });

  async function findTask(name) {
    return models.task.query().findOne({ name });
  }

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
    const task = await findTask(params.name);
    expect(task).toBeDefined();

    const response = await request(app, "GET", `/tasks/${task.id}`, cookie);
    expect(response.statusCode).toBe(200);
  });

  it("should create a new task", async () => {
    const params = testData.tasks.new;
    const response = await request(app, "POST", "/tasks", cookie, params);
    expect(response.statusCode).toBe(302);

    const task = await findTask(params.name);
    expect(task).toMatchObject(params);
  });

  it("should delete a task", async () => {
    const params = testData.tasks.existing.delete;
    const taskToDelete = await findTask(params.name);
    expect(taskToDelete).toBeDefined();

    const response = await request(app, "DELETE", `/tasks/${taskToDelete.id}`, cookie);
    expect(response.statusCode).toBe(302);

    const deletedTask = await findTask(params.name);
    expect(deletedTask).toBeUndefined();
  });

  it("should update a task", async () => {
    const params = testData.tasks.existing.update;
    const task = await findTask(params.name);
    expect(task).toBeDefined();

    const updatedTaskName = "Updated Task Name";
    const response = await request(app, "PATCH", `/tasks/${task.id}`, cookie, { 
      ...params, name: updatedTaskName 
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
