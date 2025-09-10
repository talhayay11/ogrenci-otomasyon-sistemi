import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

export default function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/students">Öğrenciler</Link>
        <Link to="/teachers">Öğretmenler</Link>
        <Link to="/courses">Dersler</Link>
        <Link to="/my-grades">Notlarım</Link>
        <button onClick={() => { logout(); navigate('/login'); }}>Çıkış</button>
      </nav>
    </div>
  );
}


