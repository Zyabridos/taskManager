import axios from 'axios';

export const resetAppState = async page => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  const cookies = await page.context().cookies();
  const cookieHeader = cookies.map(({ name, value }) => `${name}=${value}`).join('; ');

  const api = axios.create({
    baseURL,
    headers: {
      Cookie: cookieHeader,
    },
  });

  try {
    const tasks = await api.get('/api/tasks');
    for (const task of tasks.data) {
      await api.delete(`/api/tasks/${task.id}`);
    }

    const labels = await api.get('/api/labels');
    for (const label of labels.data) {
      await api.delete(`/api/labels/${label.id}`);
    }

    const statuses = await api.get('/api/statuses');
    for (const status of statuses.data) {
      await api.delete(`/api/statuses/${status.id}`);
    }
  } catch (error) {
    console.error('resetAppState error:', error.message);
  }
};
