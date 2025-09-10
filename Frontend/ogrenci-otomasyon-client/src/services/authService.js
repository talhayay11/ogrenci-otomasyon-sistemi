import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

const token = localStorage.getItem('token');
if (token) setAuthToken(token);

export const register = (email, password, role) =>
  axios.post(`${API_BASE}/auth/register`, { email, password, role });

export const login = async (email, password) => {
  // console.debug('API_BASE', API_BASE);
  const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
  setAuthToken(data.token);
  return data;
};

export const logout = () => setAuthToken(null);




