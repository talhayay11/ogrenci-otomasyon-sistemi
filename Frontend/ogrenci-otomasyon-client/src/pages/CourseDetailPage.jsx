import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addStudentToCourse, removeStudentFromCourse, fetchCourses, fetchCourseById } from '../services/courseService';
import axios from 'axios';
import { createGrade } from '../services/gradeService';
import { isAdmin, isTeacher } from '../services/authService';
import { fetchStudents } from '../services/studentService';

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
  const canManage = isTeacher() || isAdmin();
  const [allStudents, setAllStudents] = useState([]);
  const [gradeByStudent, setGradeByStudent] = useState({});
  const [commentByStudent, setCommentByStudent] = useState({});
  const [attendanceByStudent, setAttendanceByStudent] = useState({});

  const load = async () => {
    const { data } = await fetchCourseById(courseId);
    setCourse(data);
    setStatus(data?.status || 'Planned');
  };

  useEffect(() => { load(); }, [id]);
  useEffect(() => { fetchStudents().then(({ data }) => setAllStudents(data)).catch(() => setAllStudents([])); }, []);

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

  const onAddGrade = async (e) => {
    e.preventDefault();
    const scoreNum = Number(gradeScore);
    if (Number.isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100 || !gradeStudentId) return;
    await createGrade({ studentId: Number(gradeStudentId), courseId: courseId, score: scoreNum });
    // Güncellemeyi anında UI'da göster
    setGradeByStudent(prev => ({ ...prev, [gradeStudentId]: scoreNum }));
    await load();
    setGradeStudentId(''); setGradeScore('');
  };

  const onAddComment = async (e) => {
    e.preventDefault();
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';
    if (!commentStudentId || !commentText.trim()) return;
    await axios.post(`${API_BASE}/students/${Number(commentStudentId)}/comments`, commentText, { headers: { 'Content-Type': 'application/json' } });
    // UI'da anında göster
    setCommentByStudent(prev => ({ ...prev, [commentStudentId]: commentText }));
    setCommentStudentId(''); setCommentText('');
    await load();
  };

  const onMarkAttendance = async (e) => {
    e.preventDefault();
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';
    if (!attStudentId || !attDate) return;
    await axios.post(`${API_BASE}/attendance`, { studentId: Number(attStudentId), courseId, date: attDate, isPresent: attPresent });
    // UI'da anında göster
    setAttendanceByStudent(prev => ({ ...prev, [attStudentId]: { date: attDate, isPresent: attPresent } }));
    setAttStudentId(''); setAttDate(''); setAttPresent(true);
    await load();
  };

  if (!course) return <div style={{ padding: 24 }}>Ders bulunamadı.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>{course.courseName} ({course.courseCode})</h2>
      {canManage && (
        <div className="row" style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <label>Durum: </label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="Planned">Ders Planlandı</option>
            <option value="Ongoing">Ders Başladı</option>
            <option value="Finished">Ders Bitti</option>
            <option value="Cancelled">Ders İptal</option>
          </select>
          <button onClick={onStatusUpdate}>Durumu Güncelle</button>
        </div>
      )}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0 }}>Kayıtlı Öğrenciler</h3>
          {canManage && (
            <>
              <select value={studentId} onChange={e => setStudentId(e.target.value)}>
                <option value="">Öğrenci Seçin</option>
                {allStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (#{s.id})</option>
                ))}
              </select>
              <button onClick={onAdd}>Öğrenci Ekle</button>
            </>
          )}
        </div>
        <ul>
          {(course.students || []).map(s => (
            <li key={s.id}>
              {s.firstName} {s.lastName}
              {(() => {
                const grade = (course.grades || []).find(g => g.studentId === s.id);
                const score = grade ? grade.score : gradeByStudent[s.id];
                return score !== undefined ? (
                  <span style={{ marginLeft: 8 }}>[Not: {score}]</span>
                ) : null;
              })()}
              {commentByStudent[s.id] && (
                <span style={{ marginLeft: 8 }}>[Yorum: {commentByStudent[s.id]}]</span>
              )}
              {attendanceByStudent[s.id] && (
                <span style={{ marginLeft: 8 }}>
                  [Devam: {attendanceByStudent[s.id].date} - {attendanceByStudent[s.id].isPresent ? 'Geldi' : 'Gelmedi'}]
                </span>
              )}
              <button onClick={() => onRemove(s.id)} style={{ marginLeft: 8 }}>Sil</button>
            </li>
          ))}
        </ul>
        {canManage && (
          <form className="row" onSubmit={onAddGrade} style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <h4>Not Ekle</h4>
            <select value={gradeStudentId} onChange={e => setGradeStudentId(e.target.value)}>
              <option value="">Öğrenci Seçin</option>
              {(course.students || []).map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (#{s.id})</option>
              ))}
            </select>
            <input placeholder="Not (0-100)" type="number" min={0} max={100} value={gradeScore} onChange={e => setGradeScore(e.target.value)} />
            <button type="submit">Ekle</button>
          </form>
        )}
        {canManage && (
          <form className="row" onSubmit={onAddComment} style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <h4>Yorum Ekle</h4>
            <select value={commentStudentId} onChange={e => setCommentStudentId(e.target.value)}>
              <option value="">Öğrenci Seçin</option>
              {(course.students || []).map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (#{s.id})</option>
              ))}
            </select>
            <input placeholder="Yorum" value={commentText} onChange={e => setCommentText(e.target.value)} />
            <button type="submit">Ekle</button>
          </form>
        )}
        {canManage && (
          <form className="row" onSubmit={onMarkAttendance} style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <h4>Devamsızlık İşle</h4>
            <select value={attStudentId} onChange={e => setAttStudentId(e.target.value)}>
              <option value="">Öğrenci Seçin</option>
              {(course.students || []).map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (#{s.id})</option>
              ))}
            </select>
            <input placeholder="Tarih" type="date" value={attDate} onChange={e => setAttDate(e.target.value)} />
            <label>
              Geldi mi?
              <input type="checkbox" checked={attPresent} onChange={e => setAttPresent(e.target.checked)} />
            </label>
            <button type="submit">Kaydet</button>
          </form>
        )}
      </div>
    </div>
  );
}


