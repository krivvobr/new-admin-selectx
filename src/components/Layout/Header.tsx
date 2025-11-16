import { useLocation } from 'react-router-dom';
import './Header.css';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/properties': 'Propriedades',
  '/leads': 'Leads',
  '/cities': 'Cidades',
  '/neighborhoods': 'Bairros',
  '/profiles': 'Usuários',
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h2 className="header-title">{title}</h2>
        </div>
        <div className="header-right">
          <div className="header-user">
            <div className="user-avatar">AD</div>
            <span className="user-name">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

