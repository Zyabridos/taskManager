// User can have many tasks - O2M model
const objectionUnique = require("objection-unique");
const BaseModel = require("./BaseModel.cjs");
const encrypt = require("../lib/secure.cjs");

const unique = objectionUnique({ fields: ["email"] });

module.exports = class User extends unique(BaseModel) {
  // Метод tableName указывает таблицу базы данных, с которой связана модель
  static get tableName() {
    return "users";
  }

  // ну тут структру примерно как в ЬД
  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password"],
      properties: {
        id: { type: "integer" },
        first_name: { type: "string", minLength: 1 },
        last_name: { type: "string", minLength: 1 },
        email: { type: "string", minLength: 1 },
        password_digest: { type: "string", minLength: 3 },
      },
    };
  }

  // сеттер (захэшированного) пароля
  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  // метод, проверяющий верность пароля
  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
};
