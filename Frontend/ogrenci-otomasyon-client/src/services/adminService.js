import axios from 'axios';
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';

export const resetPassword = (email, newPassword) =>
  axios.post(`${API_BASE}/admin/reset-password`, { email, newPassword });



