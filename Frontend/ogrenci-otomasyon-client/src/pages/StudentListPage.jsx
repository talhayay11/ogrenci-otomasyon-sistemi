import { useEffect, useState } from 'react';
import { fetchStudents, createStudent, deleteStudent, updateStudent } from '../services/studentService';
import { resetPassword } from '../services/adminService';
import { isAdmin, isTeacher } from '../services/authService';

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', studentNumber: '' });
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', studentNumber: '' });

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

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      return;
    }
    try {
      await deleteStudent(studentId);
      await load();
    } catch (err) {
      alert('Öğrenci silinemedi.');
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setEditForm({
      firstName: student.firstName,
      lastName: student.lastName,
      studentNumber: student.studentNumber
    });
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(editingStudent.id, editForm);
      setEditingStudent(null);
      setEditForm({ firstName: '', lastName: '', studentNumber: '' });
      await load();
    } catch (err) {
      alert('Öğrenci güncellenemedi.');
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setEditForm({ firstName: '', lastName: '', studentNumber: '' });
  };

  const canManage = isAdmin() || isTeacher();
  const canResetPassword = isAdmin();
  const canDelete = isAdmin();

  return (
    <div style={{ padding: 24 }}>
      <h2>Öğrenciler</h2>
      {canManage && (
        <form className="row" onSubmit={onSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input placeholder="Ad" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          <input placeholder="Soyad" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          <input placeholder="Numara" value={form.studentNumber} onChange={e => setForm({ ...form, studentNumber: e.target.value })} />
          <button type="submit">Ekle</button>
        </form>
      )}
      <ul className="card" style={{ marginTop: 12 }}>
        {students.map(s => {
          const clean = (t) => (t || '').replace(/\s*\(Güncel\)\s*/gi, '').trim();
          const isEditing = editingStudent && editingStudent.id === s.id;
          
          return (
            <li key={s.id} style={{ marginBottom: 12, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}>
              {isEditing ? (
                <form onSubmit={handleUpdateStudent} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input 
                    placeholder="Ad" 
                    value={editForm.firstName} 
                    onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} 
                    required
                  />
                  <input 
                    placeholder="Soyad" 
                    value={editForm.lastName} 
                    onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} 
                    required
                  />
                  <input 
                    placeholder="Numara" 
                    value={editForm.studentNumber} 
                    onChange={e => setEditForm({ ...editForm, studentNumber: e.target.value })} 
                    required
                  />
                  <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>
                    Kaydet
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}
                  >
                    İptal
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span>{clean(s.firstName)} {clean(s.lastName)} ({s.studentNumber})</span>
                  {canManage && (
                    <button 
                      onClick={() => handleEditStudent(s)} 
                      style={{ 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Düzenle
                    </button>
                  )}
                  {canResetPassword && (
                    <button onClick={() => onResetPassword(s)} style={{ marginLeft: 8 }}>Şifre Sıfırla</button>
                  )}
                  {canDelete && (
                    <button 
                      onClick={() => handleDeleteStudent(s.id)}
                      style={{ 
                        marginLeft: 'auto', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Sil
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}


