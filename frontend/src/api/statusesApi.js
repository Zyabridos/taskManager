import createCrudApi from './crudFactory';

const base = `${process.env.NEXT_PUBLIC_API_BASE}/api/statuses`;
export const statusesApi = createCrudApi(base);
