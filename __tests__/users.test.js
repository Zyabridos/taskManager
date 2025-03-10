import _ from "lodash";
import fastify from "fastify";
import init from "../server/plugin/index.js";
import encrypt from "../server/lib/secure.cjs";
import { getTestData, prepareData, makeLogin } from "./helpers/index.js";
import request from "./helpers/request.js";
import dotenv from "dotenv";
import setUpTestsEnv from "./helpers/setUpTestsEnv.js";

dotenv.config({ path: ".env.test" });

describe("test users CRUD", () => {
  let app;
  let models;
  let knex;
  const testData = getTestData();

  beforeEach(async () => {
    ({ app, knex, models } = await setUpTestsEnv());
    testData = await prepareData(app);
    cookie = await makeLogin(app, testData.users.existing.author);
  });

  async function findUser(email) {
    return models.user.query().findOne({ email });
  }

  it("should return users list", async () => {
    const response = await request(app, "GET", app.reverse("users"));
    expect(response.statusCode).toBe(200);
  });

  it("should return new user registration page", async () => {
    const response = await request(app, "GET", app.reverse("newUser"));
    expect(response.statusCode).toBe(200);
  });

  it("should create a new user", async () => {
    const params = testData.users.new;
    const response = await request(app, "POST", "/users", null, params);
    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(params, "password"),
      passwordDigest: encrypt(params.password),
    };
    const user = await findUser(params.email);
    expect(user).toMatchObject(expected);
  });

  it("should delete a user", async () => {
    const params = testData.users.existing.fixed;
    const userToDelete = await findUser(params.email);
    expect(userToDelete).toBeDefined();

    const cookie = await makeLogin(app, testData.users.existing.fixed);
    const response = await request(
      app,
      "DELETE",
      `/users/${userToDelete.id}`,
      cookie,
      params,
    );
    expect(response.statusCode).toBe(302);

    const deletedUser = await findUser(params.email);
    expect(deletedUser).toBeUndefined();
  });

  it("should update a user", async () => {
    const params = testData.users.existing.fixed;
    const user = await findUser(params.email);
    expect(user).toBeDefined();

    const newLastName = "Golovach";
    const cookie = await makeLogin(app, testData.users.existing.fixed);
    const response = await request(app, "PATCH", `/users/${user.id}`, cookie, {
      ...params,
      lastName: newLastName,
    });

    expect(response.statusCode).toBe(302);

    const updatedUser = await user.$query();
    expect(updatedUser.lastName).toEqual(newLastName);
  });

  it("should NOT be deleted when they have a task", async () => {
    const params = testData.users.existing.fixed;
    const userToDelete = await findUser(params.email);
    expect(userToDelete).toBeDefined();

    const taskWithUser = await models.task.query().insert({
      name: "Test task with user",
      description: "This task is linked to a user",
      statusId: 1,
      authorId: userToDelete.id,
      executorId: userToDelete.id,
    });

    expect(taskWithUser).toBeDefined();

    const userNotSupposedToBeDeleted = await findUser(params.email);
    expect(userNotSupposedToBeDeleted).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
    await knex.destroy();
  });
});
