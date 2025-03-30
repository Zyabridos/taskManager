import axios from 'axios';

const base = `${process.env.NEXT_PUBLIC_API_BASE}/api/statuses`;

export const getStatuses = async () => {
  const response = await axios.get(base);
  return response.data;
};

export const createStatus = async data => {
  const response = await axios.post(base, data);
  return response.data;
};

export const getStatus = async id => {
  const response = await axios.get(`${base}/${id}`);
  return response.data;
};

export const updateStatus = async (id, data) => {
  const response = await axios.patch(`${base}/${id}`, data);
  return response.data;
};

export const deleteStatus = async id => {
  const response = await axios.delete(`${base}/${id}`);
  return response.data;
};
