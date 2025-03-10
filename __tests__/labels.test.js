import fastify from "fastify";
import init from "../server/plugin/index.js";
import { prepareData, makeLogin } from "./helpers/index.js";
import dotenv from "dotenv";
import request from "./helpers/request.js";

dotenv.config({ path: ".env.test" });

describe("test labels CRUD", () => {
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

  async function findLabel(name) {
    return models.label.query().findOne({ name });
  }

  it("should show a list of labels", async () => {
    const response = await request(app, "GET", "/labels");
    expect(response.statusCode).toBe(200);
  });

  it("should new", async () => {
    const response = await request(app, "GET", "/labels/new");
    expect(response.statusCode).toBe(200);
  });

  it("should create a new label", async () => {
    const params = testData.labels.new;
    const response = await request(app, "POST", "/labels", params);
    expect(response.statusCode).toBe(302);

    const label = await findLabel(params.name);
    expect(label).toMatchObject(params);
  });

  it("should delete a label", async () => {
    const params = testData.labels.existing.delete;
    const labelToDelete = await findLabel(params.name);
    expect(labelToDelete).toBeDefined();

    const response = await request(app, "DELETE", `/labels/${labelToDelete.id}`);
    expect(response.statusCode).toBe(302);

    const deletedLabel = await findLabel(params.name);
    expect(deletedLabel).toBeUndefined();
  });

  it("should NOT delete label if it's linked to a task", async () => {
    const params = testData.labels.existing.delete;
    const labelToDelete = await findLabel(params.name);
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

    const response = await request(app, "DELETE", `/labels/${labelToDelete.id}`);
    expect(response.statusCode).toBe(400);

    const stillExistingLabel = await findLabel(params.name);
    expect(stillExistingLabel).toBeDefined();
  });

  it("should update a label", async () => {
    const params = testData.labels.existing.update;
    const label = await findLabel(params.name);
    expect(label).toBeDefined();

    const updatedName = "Updated Label";
    const response = await request(app, "PATCH", `/labels/${label.id}`, {
      name: updatedName,
    });
    expect(response.statusCode).toBe(302);

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
