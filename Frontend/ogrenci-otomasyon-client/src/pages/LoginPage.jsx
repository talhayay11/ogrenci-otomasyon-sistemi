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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      transition: 'background 0.3s ease'
    }}>
      <div style={{ 
        maxWidth: 420, 
        width: '100%',
        backgroundColor: 'var(--card)',
        borderRadius: '12px',
        boxShadow: '0 10px 25px var(--shadow-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        transition: 'all 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
          color: 'white',
          padding: '24px',
          textAlign: 'center',
          transition: 'background 0.3s ease'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>📚 Öğrenci Otomasyon</h1>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>Eğitim yönetim platformu</p>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          transition: 'all 0.3s ease'
        }}>
          <button 
            onClick={() => setTab('login')} 
            style={{ 
              flex: 1,
              padding: '16px',
              border: 'none',
              backgroundColor: tab === 'login' ? 'var(--card)' : 'transparent',
              color: tab === 'login' ? 'var(--fg)' : 'var(--muted)',
              fontWeight: tab === 'login' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🔐 Giriş Yap
          </button>
          <button 
            onClick={() => setTab('register')} 
            style={{ 
              flex: 1,
              padding: '16px',
              border: 'none',
              backgroundColor: tab === 'register' ? 'var(--card)' : 'transparent',
              color: tab === 'register' ? 'var(--fg)' : 'var(--muted)',
              fontWeight: tab === 'register' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📝 Kayıt Ol
          </button>
        </div>

        <div style={{ padding: '24px' }}>

          {tab === 'login' && (
            <div>
              <div style={{ 
                display: 'flex', 
                gap: 8, 
                marginBottom: 20,
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                padding: '4px'
              }}>
                <button 
                  onClick={() => setRoleTab('Teacher')} 
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: roleTab === 'Teacher' ? '#007bff' : 'transparent',
                    color: roleTab === 'Teacher' ? 'white' : '#6c757d',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  👨‍🏫 Öğretmen
                </button>
                <button 
                  onClick={() => setRoleTab('Student')} 
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: roleTab === 'Student' ? '#007bff' : 'transparent',
                    color: roleTab === 'Student' ? 'white' : '#6c757d',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  👨‍🎓 Öğrenci
                </button>
              </div>

              <h3 style={{ marginBottom: 20, color: 'var(--fg)', textAlign: 'center' }}>
                {roleTab === 'Teacher' ? '👨‍🏫' : '👨‍🎓'} {roleTab} Girişi
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: '500', color: 'var(--fg)' }}>
                    📧 Email
                  </label>
                  <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      transition: 'all 0.3s ease'
                    }}
                    placeholder="email@example.com"
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: '500', color: 'var(--fg)' }}>
                    🔒 Şifre
                  </label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      transition: 'all 0.3s ease'
                    }}
                    placeholder="••••••••"
                  />
                </div>
                {error && (
                  <div style={{ 
                    color: 'var(--danger)', 
                    backgroundColor: 'var(--danger)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--danger)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    marginBottom: 16,
                    fontSize: '14px'
                  }}>
                    ⚠️ {error}
                  </div>
                )}
                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🚀 Giriş Yap
                </button>
              </form>

              <div style={{ 
                marginTop: 20, 
                padding: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'var(--primary)',
                textAlign: 'center',
                border: '1px solid var(--primary)'
              }}>
                <strong>🔑 Admin Giriş:</strong><br />
                admin@test.com / Admin123!*
              </div>
            </div>
          )}

          {tab === 'register' && (
            <RegisterInline />
          )}
        </div>
      </div>
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
      <h3 style={{ marginBottom: 20, color: 'var(--fg)', textAlign: 'center' }}>
        📝 Yeni Hesap Oluştur
      </h3>
      
      <form onSubmit={doRegister}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: '500', color: 'var(--fg)' }}>
            📧 Email
          </label>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              backgroundColor: 'var(--bg)',
              color: 'var(--fg)',
              transition: 'all 0.3s ease'
            }}
            placeholder="email@example.com"
            required
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: '500', color: 'var(--fg)' }}>
            🔒 Şifre
          </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              backgroundColor: 'var(--bg)',
              color: 'var(--fg)',
              transition: 'all 0.3s ease'
            }}
            placeholder="••••••••"
            required
          />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: '500', color: 'var(--fg)' }}>
            👤 Rol Seçin
          </label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              backgroundColor: 'var(--bg)',
              color: 'var(--fg)',
              transition: 'all 0.3s ease'
            }}
          >
            <option value="Student">👨‍🎓 Öğrenci</option>
            <option value="Teacher">👨‍🏫 Öğretmen</option>
          </select>
        </div>
        
        {message && (
          <div style={{ 
            color: message.includes('başarılı') ? 'var(--success)' : 'var(--danger)',
            backgroundColor: message.includes('başarılı') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${message.includes('başarılı') ? 'var(--success)' : 'var(--danger)'}`,
            borderRadius: '4px',
            padding: '8px 12px',
            marginBottom: 16,
            fontSize: '14px'
          }}>
            {message.includes('başarılı') ? '✅' : '⚠️'} {message}
          </div>
        )}
        
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--success)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          🚀 Hesap Oluştur
        </button>
      </form>
      
      <div style={{ 
        marginTop: 20, 
        padding: '12px',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderRadius: '6px',
        fontSize: '12px',
        color: 'var(--warning)',
        textAlign: 'center',
        border: '1px solid var(--warning)'
      }}>
        <strong>💡 Bilgi:</strong><br />
        Güvenli bir şifre oluşturun (en az 8 karakter, büyük/küçük harf, rakam ve özel karakter)
      </div>
    </div>
  );
}


