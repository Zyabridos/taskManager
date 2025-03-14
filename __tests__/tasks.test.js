import _ from "lodash";
import { prepareData, makeLogin } from "./helpers/index.js";
import { checkResponseCode, findEntity } from "./helpers/utils.js";
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
    await knex.migrate.rollback();
    await knex.migrate.latest();
    testData = await prepareData(app);
    cookie = await makeLogin(app, testData.users.existing.author);
  });

  async function checkTaskExists(name) {
    return findEntity(models.task, "name", name);
  }

  it("should show a list of tasks", async () => {
    await checkResponseCode(app, "GET", "/tasks", cookie);
  });

  it("should display new task creation page", async () => {
    await checkResponseCode(app, "GET", "/tasks/new", cookie);
  });

  it("should return a particular task", async () => {
    const params = testData.tasks.existing.update;
    const task = await models.task.query().findOne({ name: params.name });
    expect(task).toBeDefined();

    const response = await app.inject({
      method: "GET",
      url: `/tasks/${task.id}`,
      headers: { cookie: `session=${cookie.session}` },
    });

    expect(response.statusCode).toBe(200);
  });

  it("should create a new task", async () => {
    const params = testData.tasks.new;
    cookie = await makeLogin(app, testData.users.existing.author);

    const taskData = { data: params };

    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      headers: { cookie: `session=${cookie.session}` },
      payload: taskData,
    });

    expect(response.statusCode).toBe(302);

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
      { ...params, name: updatedTaskName },
      302,
    );

    const updatedTask = await models.task.query().findById(task.id);
    expect(updatedTask.name).toEqual(updatedTaskName);
  });

  afterAll(async () => {
    await app.close();
  });
});

//  npx jest __tests__/tasks.test.js
