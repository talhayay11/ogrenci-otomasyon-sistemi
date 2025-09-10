import { useEffect, useState } from 'react';
import { fetchCourses, createCourse } from '../services/courseService';
import { Link } from 'react-router-dom';

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseName: '', courseCode: '', teacherId: '' });

  const load = async () => {
    const { data } = await fetchCourses();
    setCourses(data);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await createCourse({
      courseName: form.courseName,
      courseCode: form.courseCode,
      teacherId: Number(form.teacherId || 0)
    });
    setForm({ courseName: '', courseCode: '', teacherId: '' });
    await load();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Dersler</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Ders Adı" value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} />
        <input placeholder="Kod" value={form.courseCode} onChange={e => setForm({ ...form, courseCode: e.target.value })} />
        <input placeholder="TeacherId" value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })} />
        <button type="submit">Ekle</button>
      </form>
      <ul>
        {courses.map(c => (
          <li key={c.id}>
            <Link to={`/courses/${c.id}`}>{c.courseName} ({c.courseCode})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


