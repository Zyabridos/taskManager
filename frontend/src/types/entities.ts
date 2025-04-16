export type Status = {
  id: number;
  name: string;
  createdAt: string;
};

export type Label = {
  id: number;
  name: string;
  createdAt: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  createdAt: string;
};
