import createCrudApi from './crudFactory';

const base = `${process.env.NEXT_PUBLIC_API_BASE}/api/users`;
export const usersApi = createCrudApi(base);
