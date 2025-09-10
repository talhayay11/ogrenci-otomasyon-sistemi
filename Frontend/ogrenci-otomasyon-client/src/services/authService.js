import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
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
  try {
    const payload = JSON.parse(atob(data.token.split('.')[1]));
    const roles = payload['role']
      ? (Array.isArray(payload['role']) ? payload['role'] : [payload['role']])
      : (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          ? (Array.isArray(payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
              ? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
              : [payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']])
          : []);
    localStorage.setItem('roles', JSON.stringify(roles));
  } catch {}
  return data;
};

export const logout = () => setAuthToken(null);

export const getRoles = () => {
  try { return JSON.parse(localStorage.getItem('roles') || '[]'); } catch { return []; }
};
export const isAdmin = () => getRoles().includes('Admin');
export const isTeacher = () => getRoles().includes('Teacher');
export const isStudent = () => getRoles().includes('Student');




