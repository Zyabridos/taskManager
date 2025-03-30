import axios from 'axios';

const createCrudApi = baseUrl => ({
  getAll: async () => {
    const response = await axios.get(baseUrl);
    return response.data;
  },

  create: async data => {
    const response = await axios.post(baseUrl, data);
    return response.data;
  },

  getById: async id => {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.patch(`${baseUrl}/${id}`, data);
    return response.data;
  },

  remove: async id => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  },
});

export default createCrudApi;
