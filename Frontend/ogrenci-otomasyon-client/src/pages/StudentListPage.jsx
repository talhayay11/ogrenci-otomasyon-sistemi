import { useEffect, useState } from 'react';
import { fetchStudents, createStudent } from '../services/studentService';
import { resetPassword } from '../services/adminService';

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

  const onResetPassword = async (s) => {
    const newPass = prompt('Yeni şifre belirleyin', 'Student123!*');
    if (!newPass) return;
    await resetPassword(s.email || `${s.firstName}.${s.lastName}@example.com`, newPass);
    alert('Şifre güncellendi.');
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Öğrenciler</h2>
      <form className="row" onSubmit={onSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Ad" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input placeholder="Soyad" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        <input placeholder="Numara" value={form.studentNumber} onChange={e => setForm({ ...form, studentNumber: e.target.value })} />
        <button type="submit">Ekle</button>
      </form>
      <ul className="card" style={{ marginTop: 12 }}>
        {students.map(s => (
          <li key={s.id}>
            {s.firstName} {s.lastName} ({s.studentNumber})
            <button onClick={() => onResetPassword(s)} style={{ marginLeft: 8 }}>Şifre Sıfırla</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


