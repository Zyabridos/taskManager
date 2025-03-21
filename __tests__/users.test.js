import dotenv from "dotenv";
import _ from "lodash";
import encrypt from "../server/lib/secure.cjs";
import { makeLogin } from "./helpers/index.js";
import { checkResponseCode } from "./helpers/utils.js";
import { setStandardBeforeEach } from "./helpers/setUpTestsEnv.js";

dotenv.config({ path: ".env.test" });

describe("test users CRUD", () => {
  let app;
  let models;
  let knex;
  let testData;
  let cookie;

  const getTestContext = setStandardBeforeEach();
  beforeEach(() => {
    ({ app, knex, models, testData, cookie } = getTestContext());
  });

  it("should show a list of users", async () => {
    await checkResponseCode(app, "GET", app.reverse("users"));
  });

  it("should display new user creation page", async () => {
    await checkResponseCode(app, "GET", app.reverse("newUser"));
  });

  it("should create a new user", async () => {
    const params = testData.users.new;
    await checkResponseCode(app, "POST", "/users", null, params, 302);

    const expected = {
      ..._.omit(params, "password"),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it("should delete a user", async () => {
    const params = testData.users.existing.fixed;
    const userToDelete = await models.user
      .query()
      .findOne({ email: params.email });

    cookie = await makeLogin(app, testData.users.existing.fixed);
    await checkResponseCode(
      app,
      "DELETE",
      `/users/${userToDelete.id}`,
      cookie,
      params,
      302,
    );

    expect(
      await models.user.query().findOne({ email: params.email }),
    ).toBeUndefined();
  });

  it("should update a user", async () => {
    const params = testData.users.existing.fixed;
    const user = await models.user.query().findOne({ email: params.email });
    const newLastName = "Golovach";

    cookie = await makeLogin(app, testData.users.existing.fixed);
    await checkResponseCode(
      app,
      "PATCH",
      `/users/${user.id}`,
      cookie,
      { ...params, lastName: newLastName },
      302,
    );

    const updatedUser = await user.$query();
    expect(updatedUser.lastName).toEqual(newLastName);
  });

  it("should NOT be deleted when it has a task", async () => {
    const params = testData.users.existing.fixed;
    const userToDelete = await models.user
      .query()
      .findOne({ email: params.email });

    expect(userToDelete).toBeDefined();

    const taskWithUser = await models.task.query().insert({
      name: "Test task with user",
      description: "This task is linked to a user",
      statusId: 1,
      authorId: userToDelete.id,
      executorId: userToDelete.id,
    });

    expect(taskWithUser).toBeDefined();

    const userNotSupposedToBeDeleted = await models.user
      .query()
      .findOne({ email: params.email });
    expect(userNotSupposedToBeDeleted).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
    await knex.destroy();
  });
});
