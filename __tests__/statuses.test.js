import { prepareData, makeLogin } from "./helpers/index.js";
import dotenv from "dotenv";
import { findEntity } from "./helpers/index.js";
import { checkResponseCode, findEntity } from "./helpers/utils.js";
import setUpTestsEnv from "./helpers/setUpTestsEnv.js";

dotenv.config({ path: ".env.test" });

describe("test statuses CRUD", () => {
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

  async function checkStatusExists(name) {
    return findEntity(models.status, "name", name);
  }

  it("should return statuses list", async () => {
    await checkResponseCode(app, "GET", "/statuses", cookie);
  });

  it("should return new status creation page", async () => {
    await checkResponseCode(app, "GET", "/statuses/new", cookie);
  });

  it("should create a new status", async () => {
    const params = testData.statuses.new;
    await checkResponseCode(app, "POST", "/statuses", cookie, params, 302);

    const status = await checkStatusExists(params.name);
    expect(status).toMatchObject(params);
  });

  it("should delete a status", async () => {
    const params = testData.statuses.existing.delete;
    const statusToDelete = await checkStatusExists(params.name);
    expect(statusToDelete).toBeDefined();

    await checkResponseCode(
      app,
      "DELETE",
      `/statuses/${statusToDelete.id}`,
      cookie,
      null,
      302,
    );

    const deletedStatus = await checkStatusExists(params.name);
    expect(deletedStatus).toBeUndefined();
  });

  it("should NOT delete a status if it's linked to a task", async () => {
    const params = testData.statuses.existing.delete;
    const statusToDelete = await checkStatusExists(params.name);
    expect(statusToDelete).toBeDefined();

    const taskWithStatus = await models.task.query().insert({
      name: "Test task with status",
      description: "This task is linked to a status",
      statusId: statusToDelete.id,
      authorId: 1,
      executorId: 1,
    });

    expect(taskWithStatus).toBeDefined();

    await checkResponseCode(
      app,
      "DELETE",
      `/statuses/${statusToDelete.id}`,
      cookie,
      null,
      400,
    );

    const stillExistingStatus = await checkStatusExists(params.name);
    expect(stillExistingStatus).toBeDefined();
  });

  it("should update a status", async () => {
    const params = testData.statuses.existing.update;
    const statusToUpdate = await checkStatusExists(params.name);
    expect(statusToUpdate).toBeDefined();

    const updatedStatusName = "Updated Status";
    await checkResponseCode(
      app,
      "PATCH",
      `/statuses/${statusToUpdate.id}`,
      cookie,
      { name: updatedStatusName },
      302,
    );

    const updatedStatus = await statusToUpdate.$query();
    expect(updatedStatus.name).toEqual(updatedStatusName);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await knex.destroy();
    await app.close();
  });
});
