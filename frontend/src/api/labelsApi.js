import createCrudApi from './crudFactory';

const base = `${process.env.NEXT_PUBLIC_API_BASE}/api/labels`;
export const labelsApi = createCrudApi(base);
