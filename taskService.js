import api from './api';

export const getTasks = async ({ status = 'all', search = '', sortBy = 'newest' } = {}) => {
  const { data } = await api.get('/tasks', { params: { status, search, sortBy } });
  return data.data.tasks;
};

export const getStats = async () => {
  const { data } = await api.get('/tasks/stats');
  return data.data;
};

export const getTaskById = async (id) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data.data.task;
};

export const createTask = async (payload) => {
  const { data } = await api.post('/tasks', payload);
  return data.data.task;
};

export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.data.task;
};

export const toggleTask = async (id) => {
  const { data } = await api.patch(`/tasks/${id}/toggle`);
  return data.data.task;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};

export const deleteCompletedTasks = async () => {
  const { data } = await api.delete('/tasks/completed/all');
  return data.data.deletedCount;
};
