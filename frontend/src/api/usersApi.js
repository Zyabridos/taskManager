import createCrudApi from './crudFactory';
import routes from '../routes';

const base = `${process.env.NEXT_PUBLIC_API_BASE}${routes.api.users.list()}`;
export const usersApi = createCrudApi(base);
