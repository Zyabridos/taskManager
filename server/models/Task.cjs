const BaseModel = require("./BaseModel.cjs");

module.exports = class Task extends BaseModel {
  static get tableName() {
    return "tasks";
  }

  static modifiers = {
    filterStatus(query, statusId) {
      query.skipUndefined().where("statusId", statusId);
    },
    filterExecutor(query, executorId) {
      query.skipUndefined().where("executorId", executorId);
    },
    filterLabel(query, labelId) {
      query.skipUndefined().where("labels.id", labelId);
    },
    filterAuthor(query, authorId) {
      query.skipUndefined().where("authorId", authorId);
    },
  };

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "statusId", "authorId"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1 },
        description: { type: "string" },
        statusId: { type: "integer" },
        authorId: { type: "integer" },
        executor_id: { type: "integer" },
        labels: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      // Tasks and states
      status: {
        relation: BaseModel.BelongsToOneRelation, // Один статус может быть связан с многими задачами.
        // При этом каждая задача может иметь только один статус - O2M
        modelClass: "Status.cjs", // с этой моделью устанавливается связь
        join: {
          from: "tasks.statusId", // tasks.statusId ссылается на таблицу статусов
          to: "statuses.id", // а это ключ, по которому tasks.statusId будет искать автора
        },
      },
      // Authors and tasks
      author: {
        relation: BaseModel.BelongsToOneRelation, // у одного автора может быть неск задач,
        // но у задачи мб только один автор - O2M
        modelClass: "User.cjs", // с этой моделью устанавливается связь
        join: {
          from: "tasks.authorId", // tasks.authorId ссылается на таблицу юзеров
          to: "users.id", // а это ключ, по которому tasks.authorId будет искать автора
        },
      },
      // Executors and tasks
      executor: {
        relation: BaseModel.BelongsToOneRelation, // у одного исполнителя может быть неск задач,
        // но у задачи мб только один автор - O2M
        modelClass: "User.cjs",
        join: {
          from: "tasks.executorId",
          to: "users.id",
        },
      },
      labels: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: "Label.cjs",
        join: {
          from: "tasks.id",
          through: {
            from: "task_labels.task_id",
            to: "task_labels.label_id",
          },
          to: "labels.id",
        },
      },
    };
  }
};
