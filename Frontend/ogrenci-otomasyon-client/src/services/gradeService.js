export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';
import axios from 'axios';

export const createGrade = (payload) => axios.post(`${API_BASE}/grades`, payload);
export const fetchMyGrades = () => axios.get(`${API_BASE}/grades/my-grades`);


