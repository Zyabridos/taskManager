import { describe, beforeAll, it, expect } from "@jest/globals";
import fastify from "fastify";
import init from "../server/plugin/index.js";
import dotenv from "dotenv";
import request from "./helpers/request.js";
import setUpTestsEnv from "./helpers/setUpTestsEnv.js";

dotenv.config({ path: ".env.test" });

describe("requests", () => {
  let app;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: "pino-pretty" },
    });
    await init(app);
  });

  it("GET / should return 200", async () => {
    const res = await request(app, "GET", "/");
    expect(res.statusCode).toBe(200);
  });

  it("GET /wrong-path should return 404", async () => {
    const res = await request(app, "GET", "/wrong-path");
    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
