import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Users,
  MapPin,
  Building2,
  User,
} from 'lucide-react';
import './Sidebar.css';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/properties', label: 'Propriedades', icon: Home },
  { path: '/leads', label: 'Leads', icon: Users },
  { path: '/cities', label: 'Cidades', icon: Building2 },
  { path: '/neighborhoods', label: 'Bairros', icon: MapPin },
  { path: '/profiles', label: 'Usuários', icon: User },
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
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Icon className="sidebar-icon" size={20} />
              <span className="sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

