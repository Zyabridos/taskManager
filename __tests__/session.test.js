import fastify from "fastify";
import init from "../server/plugin/index.js";
import { prepareData, makeLogin } from "./helpers/index.js";
import request from "./helpers/request.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

describe("test session", () => {
  let app;
  let knex;
  let testData;
  let cookie;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: "pino-pretty" },
    });

    await init(app);
    knex = app.objection.knex;
    await knex.migrate.latest();
    testData = await prepareData(app);
  });

  it("should return the login page", async () => {
    const response = await request(app, "GET", "/session/new");
    expect(response.statusCode).toBe(200);
  });

  it("should log in a user", async () => {
    cookie = await makeLogin(app, {
      email: testData.users.existing.author.email,
      password: testData.users.existing.author.password,
    });

    expect(cookie).toBeDefined();
    expect(Object.keys(cookie).length).toBeGreaterThan(0);
  });

  it("should log out a user", async () => {
    cookie = await makeLogin(app, {
      email: testData.users.existing.author.email,
      password: testData.users.existing.author.password,
    });

    expect(cookie).toBeDefined();

    const response = await request(app, "DELETE", "/session", cookie);
    expect(response.statusCode).toBe(302);
  });

  afterAll(async () => {
    await app.close();
  });
});
