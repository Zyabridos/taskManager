import fastify from "fastify";
import init from "../server/plugin/index.js";
import { prepareData, makeLogin } from "./helpers/index.js";
import dotenv from "dotenv";
import request from "./helpers/request.js";

dotenv.config({ path: ".env.test" });

describe("test statuses CRUD", () => {
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

  async function findStatus(name) {
    return models.status.query().findOne({ name });
  }

  it("should return statuses list", async () => {
    const response = await request(app, "GET", "/statuses", cookie);
    expect(response.statusCode).toBe(200);
  });

  it("should return new status creation page", async () => {
    const response = await request(app, "GET", "/statuses/new", cookie);
    expect(response.statusCode).toBe(200);
  });

  it("should create a new status", async () => {
    const params = testData.statuses.new;
    const response = await request(app, "POST", "/statuses", cookie, params);
    expect(response.statusCode).toBe(302);

    const status = await findStatus(params.name);
    expect(status).toMatchObject(params);
  });

  it("should delete a status", async () => {
    const params = testData.statuses.existing.delete;
    const statusToDelete = await findStatus(params.name);
    expect(statusToDelete).toBeDefined();

    const response = await request(app, "DELETE", `/statuses/${statusToDelete.id}`, cookie);
    expect(response.statusCode).toBe(302);

    const deletedStatus = await findStatus(params.name);
    expect(deletedStatus).toBeUndefined();
  });

  it("should NOT delete status if it's linked to a task", async () => {
    const params = testData.statuses.existing.delete;
    const statusToDelete = await findStatus(params.name);
    expect(statusToDelete).toBeDefined();

    const taskWithStatus = await models.task.query().insert({
      name: "Test task with status",
      description: "This task is linked to a status",
      statusId: statusToDelete.id,
      authorId: 1,
      executorId: 1,
    });

    expect(taskWithStatus).toBeDefined();

    const response = await request(app, "DELETE", `/statuses/${statusToDelete.id}`, cookie);
    expect(response.statusCode).toBe(400);

    const stillExistingStatus = await findStatus(params.name);
    expect(stillExistingStatus).toBeDefined();
  });

  it("should update a status", async () => {
    const params = testData.statuses.existing.update;
    const statusToUpdate = await findStatus(params.name);
    expect(statusToUpdate).toBeDefined();

    const updatedStatusName = "Updated Status";
    const response = await request(app, "PATCH", `/statuses/${statusToUpdate.id}`, cookie, { name: updatedStatusName });
    expect(response.statusCode).toBe(302);

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
