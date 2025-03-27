import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { Model } from 'objection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class BaseModel extends Model {
  static get modelPaths() {
    return [__dirname];
  }
}
