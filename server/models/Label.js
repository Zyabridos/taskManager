import objectionUnique from 'objection-unique';

import BaseModel from './BaseModel.js';

const unique = objectionUnique({ fields: ['name'] });

export default class Label extends unique(BaseModel) {
  static get tableName() {
    return 'labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      tasks: {
        relation: BaseModel.HasManyRelation,
        modelClass: './Task.js',
        join: {
          from: 'labels.id',
          to: 'tasks.id',
        },
      },
    };
  }
}
