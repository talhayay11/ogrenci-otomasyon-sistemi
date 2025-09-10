import { useEffect, useState } from 'react';
import { fetchCourses, createCourse } from '../services/courseService';
import { fetchMyCourses, fetchMyEnrollments } from '../services/courseService';
import { fetchTeachers } from '../services/teacherService';
import { isAdmin, isTeacher } from '../services/authService';
import { Link } from 'react-router-dom';

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [tab, setTab] = useState('all'); // all | mine
  const [form, setForm] = useState({ courseName: '', courseCode: '', teacherId: '' });
  const [error, setError] = useState('');

  const load = async (targetTab = tab) => {
    try {
      let resp;
      if (targetTab === 'mine') {
        resp = isTeacher() ? await fetchMyCourses() : await fetchMyEnrollments();
      } else {
        resp = await fetchCourses();
      }
      const { data } = resp;
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      setCourses([]);
    }
  };

  useEffect(() => { load(); }, [tab]);
  // Ensure teachers land on "mine" and do not see "all"
  useEffect(() => {
    if (isTeacher()) {
      setTab('mine');
    }
  }, []);
  useEffect(() => {
    fetchTeachers().then(({ data }) => setTeachers(data)).catch(() => setTeachers([]));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.courseName.trim() || !form.courseCode.trim() || !form.teacherId) {
      setError('Lütfen ders adı, kod ve öğretmen seçiniz.');
      return;
    }
    try {
      await createCourse({
        courseName: form.courseName,
        courseCode: form.courseCode,
        teacherId: Number(form.teacherId)
      });
      setForm({ courseName: '', courseCode: '', teacherId: '' });
      setTab('all');
      await load('all');
    } catch (err) {
      setError('Ders eklenemedi. Öğretmen seçimini kontrol edin.');
    }
  };

  const showAllTab = isAdmin();
  const showMineTab = isTeacher();
  const canCreate = isAdmin();

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Dersler</h2>
        {showAllTab && (
          <button onClick={() => { setTab('all'); load('all'); }} disabled={tab==='all'}>Tümü</button>
        )}
        {showMineTab && (
          <button onClick={() => { setTab('mine'); load('mine'); }} disabled={tab==='mine'}>Benim Derslerim</button>
        )}
        {canCreate && (
          <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 12 }}>
            <input placeholder="Ders Adı" value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} />
            <input placeholder="Kod" value={form.courseCode} onChange={e => setForm({ ...form, courseCode: e.target.value })} />
            <select value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })}>
              <option value="">Öğretmen Seçin</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.firstName} {t.lastName} (#{t.id})</option>
              ))}
            </select>
            <button type="submit">Ekle</button>
          </form>
        )}
        {error && <span style={{ color: 'crimson' }}>{error}</span>}
      </div>
      <ul>
        {courses.map(c => (
          <li key={c.id}>
            <Link to={`/courses/${c.id}`}>{c.courseName} ({c.courseCode})</Link>
            <span style={{ marginLeft: 8 }}>
              [Öğretmen: {c.teacher ? `${c.teacher.firstName} ${c.teacher.lastName}` : 'atanmadı'}]
            </span>
          </li>
        ))}
      </ul>
      {showAllTab && tab === 'all' && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Öğretmen -> Dersler</h3>
          <ul>
            {Object.entries(
              courses.reduce((acc, c) => {
                const key = c.teacher ? `${c.teacher.firstName} ${c.teacher.lastName}` : 'Atanmamış Öğretmen';
                if (!acc[key]) acc[key] = [];
                acc[key].push(`${c.courseName} (${c.courseCode})`);
                return acc;
              }, {})
            ).map(([teacherName, courseList]) => (
              <li key={teacherName}>
                <strong>{teacherName}:</strong> {courseList.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


