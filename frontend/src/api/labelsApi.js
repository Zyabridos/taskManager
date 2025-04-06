import createCrudApi from './crudFactory';
import routes from '../routes';

const base = `${process.env.NEXT_PUBLIC_API_BASE}${routes.api.labels.list()}`;
export const labelsApi = createCrudApi(base);
