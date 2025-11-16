import Card from '../components/UI/Card';
import { Home, Users, Building2, User } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const stats = [
    { label: 'Total de Propriedades', value: '0', icon: Home, color: '#3b82f6' },
    { label: 'Leads', value: '0', icon: Users, color: '#10b981' },
    { label: 'Cidades', value: '0', icon: Building2, color: '#f59e0b' },
    { label: 'Usuários', value: '0', icon: User, color: '#8b5cf6' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Visão Geral</h1>
        <p className="dashboard-subtitle">Resumo do sistema SelectX</p>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="stat-card">
              <div className="stat-content">
                <div className="stat-icon" style={{ background: `${stat.color}15` }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <Card title="Atividades Recentes" className="dashboard-card">
          <p className="empty-state">Nenhuma atividade recente</p>
        </Card>

        <Card title="Estatísticas" className="dashboard-card">
          <p className="empty-state">Estatísticas serão exibidas aqui</p>
        </Card>
      </div>
    </div>
  );
}

