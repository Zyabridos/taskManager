import _ from "lodash";
import encrypt from "../server/lib/secure.cjs";
import { prepareData, makeLogin } from "./helpers/index.js";
import { findEntity } from "./helpers/index.js";
import dotenv from "dotenv";
import setUpTestsEnv from "./helpers/setUpTestsEnv.js";
import { checkResponseCode, findEntity } from "./helpers/utils.js";

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

  async function checkUserExists(email) {
    return findEntity(models.user, "email", email);
  }

  it("should return users list", async () => {
    await checkResponseCode(app, "GET", app.reverse("users"));
  });

  it("should return new user registration page", async () => {
    await checkResponseCode(app, "GET", app.reverse("newUser"));
  });

  it("should create a new user", async () => {
    const params = testData.users.new;
    await checkResponseCode(app, "POST", "/users", null, params, 302);

    const expected = {
      ..._.omit(params, "password"),
      passwordDigest: encrypt(params.password),
    };
    const user = await checkUserExists(params.email);
    expect(user).toMatchObject(expected);
  });

  it("should delete a user", async () => {
    const params = testData.users.existing.fixed;
    const userToDelete = await checkUserExists(params.email);
    expect(userToDelete).toBeDefined();

    const cookie = await makeLogin(app, testData.users.existing.fixed);
    await checkResponseCode(
      app,
      "DELETE",
      `/users/${userToDelete.id}`,
      cookie,
      params,
      302,
    );

    const deletedUser = await checkUserExists(params.email);
    expect(deletedUser).toBeUndefined();
  });

  it("should update a user", async () => {
    const params = testData.users.existing.fixed;
    const user = await checkUserExists(params.email);
    expect(user).toBeDefined();

    const newLastName = "Golovach";
    const cookie = await makeLogin(app, testData.users.existing.fixed);
    await checkResponseCode(
      app,
      "PATCH",
      `/users/${user.id}`,
      cookie,
      {
        ...params,
        lastName: newLastName,
      },
      302,
    );

    const updatedUser = await user.$query();
    expect(updatedUser.lastName).toEqual(newLastName);
  });

  it("should NOT be deleted when they have a task", async () => {
    const params = testData.users.existing.fixed;
    const userToDelete = await checkUserExists(params.email);
    expect(userToDelete).toBeDefined();

    const taskWithUser = await models.task.query().insert({
      name: "Test task with user",
      description: "This task is linked to a user",
      statusId: 1,
      authorId: userToDelete.id,
      executorId: userToDelete.id,
    });

    expect(taskWithUser).toBeDefined();

    const userNotSupposedToBeDeleted = await checkUserExists(params.email);
    expect(userNotSupposedToBeDeleted).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
    await knex.destroy();
  });
});
