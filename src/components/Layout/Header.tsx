import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import Button from '../UI/Button';
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
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const title = pageTitles[location.pathname] || 'Dashboard';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const userInitials = user?.email
    ?.substring(0, 2)
    .toUpperCase() || 'AD';

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h2 className="header-title">{title}</h2>
        </div>
        <div className="header-right">
          <div className="header-user">
            <div className="user-avatar">{userInitials}</div>
            <span className="user-name">{user?.email || 'Admin'}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut size={16} />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}

