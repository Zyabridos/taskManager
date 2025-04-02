import axiosInstance from './axiosInstance';

const base = `${process.env.NEXT_PUBLIC_API_BASE}/api/tasks`;

export const tasksApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    console.log('query params: ', query);
    const response = await axiosInstance.get(`${base}?${query}`);
    return response.data;
  },

  getById: async id => {
    console.log('Fetching task by id:', id);
    const response = await axiosInstance.get(`${base}/${id}`);
    return response.data;
  },

  getMeta: async () => {
    const response = await axiosInstance.get(`${base}/meta`);
    return response.data;
  },

  create: async task => {
    const payload = {
      ...task,
      labels: task.labels.map(Number),
    };
    console.log('Creating task with payload:', payload);
    const response = await axiosInstance.post(base, payload);
    return response.data;
  },

  update: async (id, task) => {
    const payload = {
      ...task,
      labels: task.labels.map(Number),
    };
    const response = await axiosInstance.patch(`${base}/${id}`, payload);
    return response.data;
  },

  remove: async id => {
    const response = await axiosInstance.delete(`${base}/${id}`);
    return response.data;
  },
};
