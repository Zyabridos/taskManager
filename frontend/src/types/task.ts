export type QueryValue = string | number | boolean | undefined;

export type Task = {
  id: number;
  name: string;
  description?: string;
  statusId: number;
  executorId?: number;
  createdAt: string;
  updatedAt?: string;
};

export type TaskQueryParams = {
  status?: number;
  executor?: number;
  label?: number;
  [key: string]: QueryValue;
};
