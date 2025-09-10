import { useState } from 'react';
import { register } from '../services/authService';
import { validatePassword, getPasswordRequirementsText, generateSecurePassword } from '../utils/passwordValidation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [message, setMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const validation = validatePassword(newPassword);
    setPasswordErrors(validation.errors);
  };

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setPassword(newPassword);
    setPasswordErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      setMessage('Parola güvenlik kurallarını karşılamıyor.');
      return;
    }
    
    try {
      await register(email, password, role);
      setMessage('Kayıt başarılı. Giriş yapabilirsiniz.');
    } catch (err) {
      setMessage('Kayıt başarısız.');
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '80px auto' }}>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Şifre</label>
          <input 
            type="password" 
            value={password} 
            onChange={handlePasswordChange}
            style={{ 
              borderColor: passwordErrors.length > 0 ? '#dc3545' : '#ced4da',
              width: '100%',
              padding: '8px',
              marginBottom: '4px'
            }}
          />
          <button 
            type="button" 
            onClick={handleGeneratePassword}
            style={{ 
              fontSize: '12px', 
              padding: '4px 8px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '8px'
            }}
          >
            Güvenli Parola Oluştur
          </button>
          {passwordErrors.length > 0 && (
            <div style={{ color: '#dc3545', fontSize: '12px', marginBottom: '8px' }}>
              {passwordErrors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          )}
          <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '8px' }}>
            <strong>Parola Gereksinimleri:</strong>
            {getPasswordRequirementsText().map((req, index) => (
              <div key={index}>• {req}</div>
            ))}
          </div>
        </div>
        <div>
          <label>Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>
        </div>
        {message && <p>{message}</p>}
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
}


