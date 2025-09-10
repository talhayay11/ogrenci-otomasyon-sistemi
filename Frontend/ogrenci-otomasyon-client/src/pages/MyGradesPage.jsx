import { useEffect, useState } from 'react';
import { fetchMyGrades } from '../services/gradeService';

export default function MyGradesPage() {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchMyGrades().then(({ data }) => setGrades(data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Notlarım</h2>
      <ul>
        {grades.map(g => (
          <li key={g.id}>Ders #{g.courseId} - Not: {g.score}</li>
        ))}
      </ul>
    </div>
  );
}


