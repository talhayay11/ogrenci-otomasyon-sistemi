import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addStudentToCourse, removeStudentFromCourse, fetchCourses } from '../services/courseService';
import axios from 'axios';
import { createGrade } from '../services/gradeService';
import { isAdmin, isTeacher } from '../services/authService';

export default function CourseDetailPage() {
  const { id } = useParams();
  const courseId = Number(id);
  const [course, setCourse] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [status, setStatus] = useState('');
  const [gradeStudentId, setGradeStudentId] = useState('');
  const [gradeScore, setGradeScore] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentStudentId, setCommentStudentId] = useState('');
  const [attStudentId, setAttStudentId] = useState('');
  const [attDate, setAttDate] = useState('');
  const [attPresent, setAttPresent] = useState(true);
  const canManage = isTeacher();

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

  const onStatusUpdate = async () => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';
    await axios.put(`${API_BASE}/courses/${courseId}/status`, status, { headers: { 'Content-Type': 'application/json' } });
    await load();
  };

  const onAddGrade = async () => {
    await createGrade({ studentId: Number(gradeStudentId), courseId: courseId, score: Number(gradeScore) });
    setGradeStudentId(''); setGradeScore('');
  };

  const onAddComment = async () => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';
    await axios.post(`${API_BASE}/students/${Number(commentStudentId)}/comments`, commentText, { headers: { 'Content-Type': 'application/json' } });
    setCommentStudentId(''); setCommentText('');
  };

  const onMarkAttendance = async () => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';
    await axios.post(`${API_BASE}/attendance`, { studentId: Number(attStudentId), courseId, date: attDate, isPresent: attPresent });
    setAttStudentId(''); setAttDate(''); setAttPresent(true);
  };

  if (!course) return <div style={{ padding: 24 }}>Ders bulunamadı.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>{course.courseName} ({course.courseCode})</h2>
      {canManage && (
        <div className="row" style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <label>Durum: </label>
          <input value={status} onChange={e => setStatus(e.target.value)} placeholder={course.status || 'Planned'} />
          <button onClick={onStatusUpdate}>Durumu Güncelle</button>
        </div>
      )}
      <div className="card">
        <h3>Kayıtlı Öğrenciler</h3>
        <ul>
          {(course.students || []).map(s => (
            <li key={s.id}>
              {s.firstName} {s.lastName}
              <button onClick={() => onRemove(s.id)} style={{ marginLeft: 8 }}>Sil</button>
            </li>
          ))}
        </ul>
        {canManage && (
          <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input placeholder="Öğrenci Id" value={studentId} onChange={e => setStudentId(e.target.value)} />
            <button onClick={onAdd}>Ekle</button>
          </div>
        )}
        {canManage && (
          <div className="row" style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <h4>Not Ekle</h4>
            <input placeholder="Öğrenci Id" value={gradeStudentId} onChange={e => setGradeStudentId(e.target.value)} />
            <input placeholder="Not" value={gradeScore} onChange={e => setGradeScore(e.target.value)} />
            <button onClick={onAddGrade}>Ekle</button>
          </div>
        )}
        {canManage && (
          <div className="row" style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <h4>Yorum Ekle</h4>
            <input placeholder="Öğrenci Id" value={commentStudentId} onChange={e => setCommentStudentId(e.target.value)} />
            <input placeholder="Yorum" value={commentText} onChange={e => setCommentText(e.target.value)} />
            <button onClick={onAddComment}>Ekle</button>
          </div>
        )}
        {canManage && (
          <div className="row" style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <h4>Devamsızlık İşle</h4>
            <input placeholder="Öğrenci Id" value={attStudentId} onChange={e => setAttStudentId(e.target.value)} />
            <input placeholder="Tarih (YYYY-MM-DD)" value={attDate} onChange={e => setAttDate(e.target.value)} />
            <label>
              Geldi mi?
              <input type="checkbox" checked={attPresent} onChange={e => setAttPresent(e.target.checked)} />
            </label>
            <button onClick={onMarkAttendance}>Kaydet</button>
          </div>
        )}
      </div>
    </div>
  );
}


