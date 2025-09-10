import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StudentListPage from './pages/StudentListPage';
import TeacherListPage from './pages/TeacherListPage';
import CourseListPage from './pages/CourseListPage';
import MyGradesPage from './pages/MyGradesPage';
import CourseDetailPage from './pages/CourseDetailPage';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useMemo(() => !!localStorage.getItem('token'), []);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">Öğrenci Otomasyon Sistemi</div>
          <button className="theme-toggle" onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/students" element={<PrivateRoute><StudentListPage /></PrivateRoute>} />
            <Route path="/teachers" element={<PrivateRoute><TeacherListPage /></PrivateRoute>} />
            <Route path="/courses" element={<PrivateRoute><CourseListPage /></PrivateRoute>} />
            <Route path="/courses/:id" element={<PrivateRoute><CourseDetailPage /></PrivateRoute>} />
            <Route path="/my-grades" element={<PrivateRoute><MyGradesPage /></PrivateRoute>} />
          </Routes>
        </main>
        <footer className="app-footer">© {new Date().getFullYear()}</footer>
      </div>
    </BrowserRouter>
  );
}
