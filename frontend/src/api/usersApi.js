import axios from 'axios';

const base = `${process.env.NEXT_PUBLIC_API_BASE}/api/users`;

export const getUsers = async () => {
  const response = await axios.get(base);
  return response.data;
};

export const createUser = async (data) => {
  const response = await axios.post(base, data);
  return response.data;
};

export const getUser = async (id) => {
  const response = await axios.get(`${base}/${id}`);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await axios.patch(`${base}/${id}`, data);
  return response.data;
};
