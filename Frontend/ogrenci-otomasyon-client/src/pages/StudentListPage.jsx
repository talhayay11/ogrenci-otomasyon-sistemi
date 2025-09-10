import { useEffect, useState } from 'react';
import { fetchStudents, createStudent, updateStudent } from '../services/studentService';

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', studentNumber: '' });

  const load = async () => {
    const { data } = await fetchStudents();
    setStudents(data);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await createStudent({
      firstName: form.firstName,
      lastName: form.lastName,
      studentNumber: form.studentNumber
    });
    setForm({ firstName: '', lastName: '', studentNumber: '' });
    await load();
  };

  const onUpdate = async (s) => {
    const updated = { ...s, lastName: s.lastName + ' (Güncel)' };
    await updateStudent(s.id, updated);
    await load();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Öğrenciler</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Ad" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input placeholder="Soyad" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        <input placeholder="Numara" value={form.studentNumber} onChange={e => setForm({ ...form, studentNumber: e.target.value })} />
        <button type="submit">Ekle</button>
      </form>
      <ul>
        {students.map(s => (
          <li key={s.id}>
            {s.firstName} {s.lastName} ({s.studentNumber})
            <button onClick={() => onUpdate(s)} style={{ marginLeft: 8 }}>Güncelle</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


