import { Link, useNavigate } from 'react-router-dom';
import { logout, isAdmin, isTeacher, isStudent } from '../services/authService';

export default function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Dashboard</h2>
      <div className="card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {isAdmin() && <Link className="btn" to="/students">Öğrenciler</Link>}
        {isAdmin() && <Link className="btn" to="/teachers">Öğretmenler</Link>}
        <Link className="btn" to="/courses">Dersler</Link>
        {isStudent() && <Link className="btn" to="/my-grades">Notlarım</Link>}
        <span style={{ flex: 1 }} />
        <button className="btn" onClick={() => { logout(); navigate('/login'); }}>Çıkış</button>
      </div>
    </div>
  );
}


