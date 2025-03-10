import _ from "lodash";
import encrypt from "../server/lib/secure.cjs";
import { prepareData, makeLogin } from "./helpers/index.js";
import request from "./helpers/request.js";
import { findEntity } from "./helpers/index.js";
import dotenv from "dotenv";
import setUpTestsEnv from "./helpers/setUpTestsEnv.js";

dotenv.config({ path: ".env.test" });

describe("test users CRUD", () => {
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
    const user = await findEntity(models.user, "email", params.email);
    expect(user).toMatchObject(expected);
  });

  it("should delete a user", async () => {
    const params = testData.users.existing.fixed;
    const userToDelete = await findEntity(models.user, "email", params.email);
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

    const deletedUser = await findEntity(models.user, "email", params.email);
    expect(deletedUser).toBeUndefined();
  });

  it("should update a user", async () => {
    const params = testData.users.existing.fixed;
    const user = await findEntity(models.user, "email", params.email);
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
    const userToDelete = await findEntity(models.user, "email", params.email);
    expect(userToDelete).toBeDefined();

    const taskWithUser = await models.task.query().insert({
      name: "Test task with user",
      description: "This task is linked to a user",
      statusId: 1,
      authorId: userToDelete.id,
      executorId: userToDelete.id,
    });

    expect(taskWithUser).toBeDefined();

    const userNotSupposedToBeDeleted = await findEntity(models.user, "email", params.email);
    expect(userNotSupposedToBeDeleted).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
    await knex.destroy();
  });
});
