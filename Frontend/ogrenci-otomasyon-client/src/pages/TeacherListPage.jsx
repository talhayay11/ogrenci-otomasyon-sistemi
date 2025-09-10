import { useEffect, useState } from 'react';
import { fetchTeachers, createTeacher, updateTeacher } from '../services/teacherService';

export default function TeacherListPage() {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '' });

  const load = async () => {
    const { data } = await fetchTeachers();
    setTeachers(data);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await createTeacher(form);
    setForm({ firstName: '', lastName: '' });
    await load();
  };

  const onUpdate = async (t) => {
    const updated = { ...t, lastName: t.lastName + ' (Güncel)' };
    await updateTeacher(t.id, updated);
    await load();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Öğretmenler</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Ad" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input placeholder="Soyad" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        <button type="submit">Ekle</button>
      </form>
      <ul>
        {teachers.map(t => (
          <li key={t.id}>
            {t.firstName} {t.lastName}
            <button onClick={() => onUpdate(t)} style={{ marginLeft: 8 }}>Güncelle</button>
          </li>
        ))}
      </ul>
    </div>
  );
}




