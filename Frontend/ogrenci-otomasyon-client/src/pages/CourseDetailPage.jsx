import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addStudentToCourse, removeStudentFromCourse, fetchCourses } from '../services/courseService';

export default function CourseDetailPage() {
  const { id } = useParams();
  const courseId = Number(id);
  const [course, setCourse] = useState(null);
  const [studentId, setStudentId] = useState('');

  const load = async () => {
    const { data } = await fetchCourses();
    const found = data.find(c => c.id === courseId);
    setCourse(found || null);
  };

  useEffect(() => { load(); }, [id]);

  const onAdd = async () => {
    await addStudentToCourse(courseId, Number(studentId));
    setStudentId('');
    await load();
  };

  const onRemove = async (sid) => {
    await removeStudentFromCourse(courseId, sid);
    await load();
  };

  if (!course) return <div style={{ padding: 24 }}>Ders bulunamadı.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>{course.courseName} ({course.courseCode})</h2>
      <div>
        <h3>Kayıtlı Öğrenciler</h3>
        <ul>
          {(course.students || []).map(s => (
            <li key={s.id}>
              {s.firstName} {s.lastName}
              <button onClick={() => onRemove(s.id)} style={{ marginLeft: 8 }}>Sil</button>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 8 }}>
          <input placeholder="Öğrenci Id" value={studentId} onChange={e => setStudentId(e.target.value)} />
          <button onClick={onAdd}>Ekle</button>
        </div>
      </div>
    </div>
  );
}


