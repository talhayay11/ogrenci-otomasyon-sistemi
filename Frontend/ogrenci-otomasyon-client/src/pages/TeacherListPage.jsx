import { useEffect, useState } from 'react';
import { fetchTeachers, createTeacher, updateTeacher } from '../services/teacherService';
import { resetPassword } from '../services/adminService';

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

  const onResetPassword = async (t) => {
    const newPass = prompt('Yeni şifre belirleyin', 'Teacher123!*');
    if (!newPass) return;
    await resetPassword(t.email || `${t.firstName}.${t.lastName}@example.com`, newPass);
    alert('Şifre güncellendi.');
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Öğretmenler</h2>
      <form className="row" onSubmit={onSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Ad" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input placeholder="Soyad" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        <button type="submit">Ekle</button>
      </form>
      <ul className="card" style={{ marginTop: 12 }}>
        {teachers.map(t => (
          <li key={t.id}>
            {t.firstName} {t.lastName}
            <button onClick={() => onResetPassword(t)} style={{ marginLeft: 8 }}>Şifre Sıfırla</button>
          </li>
        ))}
      </ul>
    </div>
  );
}




