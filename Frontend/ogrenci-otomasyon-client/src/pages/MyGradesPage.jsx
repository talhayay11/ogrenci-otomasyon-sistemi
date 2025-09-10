import { useEffect, useMemo, useState } from 'react';
import { fetchMyGrades } from '../services/gradeService';
import axios from 'axios';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function MyGradesPage() {
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [me, setMe] = useState(null);
  const chartData = useMemo(() => grades.map(g => ({ courseId: g.courseId, score: Number(g.score) })), [grades]);

  useEffect(() => {
    fetchMyGrades().then(({ data }) => setGrades(data));
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5219/api';
    axios.get(`${API_BASE}/attendance/my`).then(({ data }) => setAttendance(data));
    axios.get(`${API_BASE}/students/me`).then(({ data }) => setMe(data)).catch(() => {});
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Notlarım</h2>
      <div className="card" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="courseId" tick={{ fill: 'var(--muted)' }} />
            <YAxis tick={{ fill: 'var(--muted)' }} domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ul>
        {grades.map(g => (
          <li key={g.id}>Ders #{g.courseId} - Not: {g.score}</li>
        ))}
      </ul>
      <h2>Devamsızlıklarım</h2>
      <ul>
        {attendance.map(a => (
          <li key={a.id}>Ders #{a.courseId} - {a.date} - {a.isPresent ? 'Geldi' : 'Gelmedi'}</li>
        ))}
      </ul>
      {me && (
        <div>
          <h2>Profilim</h2>
          <div>{me.firstName} {me.lastName} - {me.studentNumber}</div>
        </div>
      )}
    </div>
  );
}


