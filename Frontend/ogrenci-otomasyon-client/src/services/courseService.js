export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';
import axios from 'axios';

export const fetchCourses = () => axios.get(`${API_BASE}/courses`);
export const fetchCourseById = (id) => axios.get(`${API_BASE}/courses/${id}`);
export const createCourse = (payload) => axios.post(`${API_BASE}/courses`, payload);
export const deleteCourse = (id) => axios.delete(`${API_BASE}/courses/${id}`);
export const fetchMyCourses = () => axios.get(`${API_BASE}/courses/my-courses`);
export const fetchMyEnrollments = () => axios.get(`${API_BASE}/courses/my-enrollments`);
export const addStudentToCourse = (courseId, studentId) => axios.post(`${API_BASE}/courses/${courseId}/students/${studentId}`);
export const removeStudentFromCourse = (courseId, studentId) => axios.delete(`${API_BASE}/courses/${courseId}/students/${studentId}`);
export const assignTeacherToCourse = (courseId, teacherId) => axios.put(`${API_BASE}/courses/${courseId}/assign-teacher/${teacherId}`);


