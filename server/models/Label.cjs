const objectionUnique = require("objection-unique");
const BaseModel = require("./BaseModel.cjs");

const unique = objectionUnique({ fields: ["name"] });

module.exports = class Label extends unique(BaseModel) {
  static get tableName() {
    return "labels";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      // Labels and tasks
      tasks: {
        relation: BaseModel.HasManyRelation, // one label can have many tasks and the opposite - M2M relation
        modelClass: "Task.cjs",
        join: {
          from: "labels.id",
          to: "tasks.id",
        },
      },
    };
  }
};
