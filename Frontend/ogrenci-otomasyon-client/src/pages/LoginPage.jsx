import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [roleTab, setRoleTab] = useState('Teacher'); // Teacher | Student for login

  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('Admin123!*');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Giriş başarısız.');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '60px auto' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab('login')} disabled={tab==='login'}>Giriş</button>
        <button onClick={() => setTab('register')} disabled={tab==='register'}>Kayıt</button>
      </div>

      {tab === 'login' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button onClick={() => setRoleTab('Teacher')} disabled={roleTab==='Teacher'}>Öğretmen</button>
            <button onClick={() => setRoleTab('Student')} disabled={roleTab==='Student'}>Öğrenci</button>
          </div>

          <h2>{roleTab} Girişi</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label>Şifre</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Giriş</button>
          </form>

          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
            Admin giriş için: admin@test.com / Admin123!*
          </div>
        </div>
      )}

      {tab === 'register' && (
        <RegisterInline />
      )}
    </div>
  );
}

function RegisterInline() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [message, setMessage] = useState('');

  const doRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5219/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      if (!res.ok) throw new Error('register failed');
      setMessage('Kayıt başarılı. Giriş sekmesinden giriş yapabilirsiniz.');
    } catch (err) {
      setMessage('Kayıt başarısız.');
    }
  };

  return (
    <div>
      <h2>Kayıt Ol</h2>
      <form onSubmit={doRegister}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Şifre</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Student">Öğrenci</option>
            <option value="Teacher">Öğretmen</option>
          </select>
        </div>
        {message && <p>{message}</p>}
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
}


