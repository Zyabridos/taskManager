const BaseModel = require('./BaseModel.cjs');

module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer', minLength: 1 },
        creatorId: { type: 'integer' },
        executorId: { type: 'integer' },
        labels: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
  return {
    // Tasks and states
    status: {
      relation: BaseModel.BelongsToOneRelation, // Один статус может быть связан с многими задачами. 
      // При этом каждая задача может иметь только один статус - O2M
      modelClass: 'Status.cjs', // с этой моделью устанавливается связь
      join: {
        from: 'tasks.statusId', // tasks.statusId ссылается на таблицу статусов
        to: 'statuses.id', // а это ключ, по которому tasks.statusId будет искать автора
      },
    },
    // Authors and tasks
    author: {
      relation: BaseModel.BelongsToOneRelation, // у одного автора может быть неск задач,
      // но у задачи мб только один автор - O2M
      modelClass: 'User.cjs', // с этой моделью устанавливается связь
      join: {
        from: 'tasks.authorId', // tasks.authorId ссылается на таблицу юзеров
        to: 'users.id', // а это ключ, по которому tasks.authorId будет искать автора
      },
    },
    // Executors and tasks
    executor: {
      relation: BaseModel.BelongsToOneRelation, // у одного исполнителя может быть неск задач,
      // но у задачи мб только один автор - O2M
      modelClass: 'User.cjs',
      join: {
        from: 'tasks.executorId',
        to: 'users.id',
      },
    },
    // Task and labels
    // coming soon... 
  };
}
};
