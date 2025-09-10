export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';
import axios from 'axios';

export const fetchStudents = () => axios.get(`${API_BASE}/students`);
export const fetchStudent = (id) => axios.get(`${API_BASE}/students/${id}`);
export const createStudent = (payload) => axios.post(`${API_BASE}/students`, payload);
export const updateStudent = (id, payload) => axios.put(`${API_BASE}/students/${id}`, payload);


