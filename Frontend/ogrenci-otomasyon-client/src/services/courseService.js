export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';
import axios from 'axios';

export const fetchCourses = () => axios.get(`${API_BASE}/courses`);
export const createCourse = (payload) => axios.post(`${API_BASE}/courses`, payload);
export const fetchMyCourses = () => axios.get(`${API_BASE}/courses/my-courses`);
export const addStudentToCourse = (courseId, studentId) => axios.post(`${API_BASE}/courses/${courseId}/students/${studentId}`);
export const removeStudentFromCourse = (courseId, studentId) => axios.delete(`${API_BASE}/courses/${courseId}/students/${studentId}`);


