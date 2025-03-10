import { prepareData, makeLogin } from "./helpers/index.js";
import dotenv from "dotenv";
import { findEntity } from "./helpers/index.js";
import setUpTestsEnv from "./helpers/setUpTestsEnv.js";
import { checkResponseCode } from "./helpers/utils.js";

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

  async function checkLabelExists(name) {
    return findEntity(models.label, "name", name);
  }

  it("should show a list of labels", async () => {
    await checkResponseCode(app, "GET", "/labels", cookie);
  });

  it("should return new label creation page", async () => {
    await checkResponseCode(app, "GET", "/labels/new", cookie);
  });

  it("should create a new label", async () => {
    const params = testData.labels.new;
    await checkResponseCode(app, "POST", "/labels", cookie, params, 302);

    const label = await checkLabelExists(params.name);
    expect(label).toMatchObject(params);
  });

  it("should delete a label", async () => {
    const params = testData.labels.existing.delete;
    const labelToDelete = await checkLabelExists(params.name);
    expect(labelToDelete).toBeDefined();

    await checkResponseCode(
      app,
      "DELETE",
      `/labels/${labelToDelete.id}`,
      cookie,
      null,
      302,
    );

    const deletedLabel = await checkLabelExists(params.name);
    expect(deletedLabel).toBeUndefined();
  });

  it("should NOT delete a label if it's linked to a task", async () => {
    const params = testData.labels.existing.delete;
    const labelToDelete = await checkLabelExists(params.name);
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

    await checkResponseCode(
      app,
      "DELETE",
      `/labels/${labelToDelete.id}`,
      cookie,
      null,
      400,
    );

    const stillExistingLabel = await checkLabelExists(params.name);
    expect(stillExistingLabel).toBeDefined();
  });

  it("should update a label", async () => {
    const params = testData.labels.existing.update;
    const label = await checkLabelExists(params.name);
    expect(label).toBeDefined();

    const updatedName = "Updated Label";
    await checkResponseCode(
      app,
      "PATCH",
      `/labels/${label.id}`,
      cookie,
      { name: updatedName },
      302,
    );

    const updatedLabel = await label.$query();
    expect(updatedLabel.name).toEqual(updatedName);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await knex.destroy();
    await app.close();
  });
});
