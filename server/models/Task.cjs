const BaseModel = require('./BaseModel.cjs');

module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static modifiers = {
    filterStatus(query, statusId) {
      query.skipUndefined().where('statusId', statusId);
    },
    filterExecutor(query, executorId) {
      query.skipUndefined().where('executorId', executorId);
    },
    filterLabel(query, labelId) {
      query.skipUndefined().where('labels.id', labelId);
    },
    filterAuthor(query, authorId) {
      query.skipUndefined().where('authorId', authorId);
    },
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'authorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer', minimum: 1 },
        authorId: { type: 'integer' },
        executor_id: { type: 'integer' },
        labels: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Status.cjs',
        join: {
          from: 'tasks.statusId',
          to: 'statuses.id',
        },
      },
      author: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User.cjs',
        join: {
          from: 'tasks.authorId',
          to: 'users.id',
        },
      },
      executor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User.cjs',
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },
      labels: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'Label.cjs',
        join: {
          from: 'tasks.id',
          through: {
            from: 'task_labels.task_id',
            to: 'task_labels.label_id',
          },
          to: 'labels.id',
        },
      },
    };
  }
};
