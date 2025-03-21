import dotenv from "dotenv";
import { checkResponseCode, findEntity } from "./helpers/utils.js";
import { setStandardBeforeEach } from "./helpers/setUpTestsEnv.js";

dotenv.config({ path: ".env.test" });

describe("test labels CRUD", () => {
  let app, knex, models, testData, cookie;
  const getTestContext = setStandardBeforeEach();
  beforeEach(() => {
    ({ app, knex, models, testData, cookie } = getTestContext());
  });

  async function checkLabelExists(name) {
    return findEntity(models.label, "name", name);
  }

  it("should show a list of labels", async () => {
    await checkResponseCode(app, "GET", "/labels", cookie);
  });

  it("should display new label creation page", async () => {
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

  it("should NOT be deleted when it has a task", async () => {
    const labelToDelete = await models.label
      .query()
      .findOne({ name: testData.labels.existing.delete.name });
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

    expect(
      await models.label.query().findOne({ name: labelToDelete.name }),
    ).toBeDefined();
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

    const updatedLabel = await models.label.query().findById(label.id);
    expect(updatedLabel.name).toEqual(updatedName);
  });

  afterAll(async () => {
    await app.close();
    await knex.destroy();
  });
});
