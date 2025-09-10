import { Link, useNavigate } from 'react-router-dom';
import { logout, isAdmin, isTeacher, isStudent } from '../services/authService';
import { useState, useEffect } from 'react';
import { fetchStudents } from '../services/studentService';
import { fetchTeachers } from '../services/teacherService';
import { fetchCourses } from '../services/courseService';
import { fetchMyGrades } from '../services/gradeService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    grades: []
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (isAdmin() || isTeacher()) {
          const [studentsRes, teachersRes, coursesRes] = await Promise.all([
            fetchStudents(),
            fetchTeachers(),
            fetchCourses()
          ]);
          setStats(prev => ({
            ...prev,
            students: studentsRes.data.length,
            teachers: teachersRes.data.length,
            courses: coursesRes.data.length
          }));
        }
        
        if (isStudent()) {
          const gradesRes = await fetchMyGrades();
          setStats(prev => ({
            ...prev,
            grades: gradesRes.data
          }));
        }
      } catch (error) {
        console.error('Stats yüklenirken hata:', error);
      }
    };

    loadStats();
  }, []);

  const courseStatusData = [
    { name: 'Planlandı', value: stats.courses > 0 ? Math.floor(stats.courses * 0.3) : 0 },
    { name: 'Devam Ediyor', value: stats.courses > 0 ? Math.floor(stats.courses * 0.4) : 0 },
    { name: 'Tamamlandı', value: stats.courses > 0 ? Math.floor(stats.courses * 0.3) : 0 }
  ];

  const gradeData = stats.grades.map(grade => ({
    name: `Ders ${grade.courseId}`,
    not: grade.score
  }));

  return (
    <div style={{ 
      padding: 24, 
      backgroundColor: 'var(--bg)', 
      minHeight: '100vh',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)', 
        color: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        marginBottom: '24px',
        boxShadow: '0 4px 6px var(--shadow)',
        transition: 'all 0.3s ease'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>📚 Öğrenci Otomasyon Sistemi</h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '1.1rem', opacity: 0.9 }}>Eğitim yönetim platformu</p>
      </div>

      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        flexWrap: 'wrap', 
        alignItems: 'center', 
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: 'var(--card)',
        borderRadius: '8px',
        boxShadow: '0 2px 4px var(--shadow)',
        border: '1px solid var(--border)',
        transition: 'all 0.3s ease'
      }}>
        {(isAdmin() || isTeacher()) && (
          <Link 
            to="/students" 
            style={{ 
              padding: '12px 24px', 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            👥 Öğrenciler
          </Link>
        )}
        {isAdmin() && (
          <Link 
            to="/teachers" 
            style={{ 
              padding: '12px 24px', 
              backgroundColor: 'var(--success)', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            👨‍🏫 Öğretmenler
          </Link>
        )}
        <Link 
          to="/courses" 
          style={{ 
            padding: '12px 24px', 
            backgroundColor: 'var(--warning)', 
            color: 'var(--fg)', 
            textDecoration: 'none', 
            borderRadius: '6px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          📚 Dersler
        </Link>
        {isStudent() && (
          <Link 
            to="/my-grades" 
            style={{ 
              padding: '12px 24px', 
              backgroundColor: 'var(--info)', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            📊 Notlarım
          </Link>
        )}
        <span style={{ flex: 1 }} />
        <button 
          onClick={() => { logout(); navigate('/login'); }}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: 'var(--danger)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          🚪 Çıkış
        </button>
      </div>

      {/* Stats Cards */}
      {(isAdmin() || isTeacher()) && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '24px' 
        }}>
          <div style={{ 
            backgroundColor: 'var(--card)', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            boxShadow: '0 2px 4px var(--shadow)',
            border: '1px solid var(--border)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.students}</div>
            <div style={{ color: 'var(--muted)' }}>Öğrenci</div>
          </div>
          <div style={{ 
            backgroundColor: 'var(--card)', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            boxShadow: '0 2px 4px var(--shadow)',
            border: '1px solid var(--border)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👨‍🏫</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.teachers}</div>
            <div style={{ color: 'var(--muted)' }}>Öğretmen</div>
          </div>
          <div style={{ 
            backgroundColor: 'var(--card)', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            boxShadow: '0 2px 4px var(--shadow)',
            border: '1px solid var(--border)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📚</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.courses}</div>
            <div style={{ color: 'var(--muted)' }}>Ders</div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px' 
      }}>
        {(isAdmin() || isTeacher()) && (
          <>
            {/* Course Status Pie Chart */}
            <div style={{ 
              backgroundColor: 'var(--card)', 
              padding: '20px', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px var(--shadow)',
              border: '1px solid var(--border)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--fg)' }}>📊 Ders Durumları</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={courseStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {courseStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Student Distribution Bar Chart */}
            <div style={{ 
              backgroundColor: 'var(--card)', 
              padding: '20px', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px var(--shadow)',
              border: '1px solid var(--border)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--fg)' }}>📈 Öğrenci Dağılımı</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: '1. Sınıf', öğrenci: Math.floor(stats.students * 0.3) },
                  { name: '2. Sınıf', öğrenci: Math.floor(stats.students * 0.25) },
                  { name: '3. Sınıf', öğrenci: Math.floor(stats.students * 0.25) },
                  { name: '4. Sınıf', öğrenci: Math.floor(stats.students * 0.2) }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="öğrenci" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {isStudent() && stats.grades.length > 0 && (
          <div style={{ 
            backgroundColor: 'var(--card)', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px var(--shadow)',
            border: '1px solid var(--border)',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--fg)' }}>📈 Not Grafiğim</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="not" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}


