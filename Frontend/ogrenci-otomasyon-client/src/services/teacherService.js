export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';
import axios from 'axios';

export const fetchTeachers = () => axios.get(`${API_BASE}/teachers`);
export const createTeacher = (payload) => axios.post(`${API_BASE}/teachers`, payload);
export const updateTeacher = (id, payload) => axios.put(`${API_BASE}/teachers/${id}`, payload);
export const deleteTeacher = (id) => axios.delete(`${API_BASE}/teachers/${id}`);


