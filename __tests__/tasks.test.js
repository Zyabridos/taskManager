import { prepareData, makeLogin } from "./helpers/index.js";
import { findEntity } from "./helpers/index.js";
import dotenv from "dotenv";
import setUpTestsEnv from "./helpers/setUpTestsEnv.js";
import { checkResponseCode, findEntity } from "./helpers/utils.js";

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

  async function checkTaskExists(name) {
    return findEntity(models.task, "name", name);
  }

  it("should return tasks list", async () => {
    await checkResponseCode(app, "GET", "/tasks", cookie);
  });

  it("should return new task creation page", async () => {
    await checkResponseCode(app, "GET", "/tasks/new", cookie);
  });

  it("should return a particular task", async () => {
    const params = testData.tasks.existing.update;
    const task = await checkTaskExists(params.name);
    expect(task).toBeDefined();

    await checkResponseCode(app, "GET", `/tasks/${task.id}`, cookie);
  });

  it("should create a new task", async () => {
    const params = testData.tasks.new;
    await checkResponseCode(app, "POST", "/tasks", cookie, params, 302);

    const task = await checkTaskExists(params.name);
    expect(task).toMatchObject(params);
  });

  it("should delete a task", async () => {
    const params = testData.tasks.existing.delete;
    const taskToDelete = await checkTaskExists(params.name);
    expect(taskToDelete).toBeDefined();

    await checkResponseCode(
      app,
      "DELETE",
      `/tasks/${taskToDelete.id}`,
      cookie,
      null,
      302,
    );

    const deletedTask = await checkTaskExists(params.name);
    expect(deletedTask).toBeUndefined();
  });

  it("should update a task", async () => {
    const params = testData.tasks.existing.update;
    const task = await checkTaskExists(params.name);
    expect(task).toBeDefined();

    const updatedTaskName = "Updated Task Name";
    await checkResponseCode(
      app,
      "PATCH",
      `/tasks/${task.id}`,
      cookie,
      {
        ...params,
        name: updatedTaskName,
      },
      302,
    );

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
