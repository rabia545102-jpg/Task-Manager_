import api from './api';

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data.data; // { user, token }
};

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data.data; // { user, token }
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const fetchMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user;
};
