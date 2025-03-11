const objectionUnique = require("objection-unique");
const BaseModel = require("./BaseModel.cjs");
const encrypt = require("../lib/secure.cjs");

const unique = objectionUnique({ fields: ["email"] });

module.exports = class User extends unique(BaseModel) {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password"],
      properties: {
        id: { type: "integer" },
        first_name: { type: "string", minLength: 1 },
        last_name: { type: "string", minLength: 1 },
        email: { type: "string", minLength: 1 },
        password: { type: 'string', minLength: 3 },
      },
    };
  }

  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  static get relationMappings() {
    return {
      tasksAuthored: {
        relation: BaseModel.HasManyRelation,
        modelClass: "Task.cjs",
        join: {
          from: "users.id",
          to: "tasks.authorId",
        },
      },
      tasksExecuted: {
        relation: BaseModel.HasManyRelation,
        modelClass: "Task.cjs",
        join: {
          from: "users.id",
          to: "tasks.executorId",
        },
      },
    };
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
};
