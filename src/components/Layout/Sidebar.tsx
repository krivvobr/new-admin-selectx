import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/properties', label: 'Propriedades', icon: '🏠' },
  { path: '/leads', label: 'Leads', icon: '👥' },
  { path: '/cities', label: 'Cidades', icon: '🏙️' },
  { path: '/neighborhoods', label: 'Bairros', icon: '📍' },
  { path: '/profiles', label: 'Usuários', icon: '👤' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">SelectX</h1>
        <span className="sidebar-subtitle">Admin</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

