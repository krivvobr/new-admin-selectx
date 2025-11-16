import { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import { useProfiles } from '../hooks/useProfiles';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Profile, UserRole } from '../types';
import './Profiles.css';

export default function Profiles() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    phone: '',
    role: 'viewer' as UserRole,
  });

  const { profiles, loading, createProfile, updateProfile, deleteProfile } = useProfiles();

  const columns = [
    { key: 'full_name', label: 'Nome Completo' },
    { key: 'phone', label: 'Telefone' },
    {
      key: 'role',
      label: 'Papel',
      render: (value: string) => (
        <span className={`badge badge-${value}`}>{value}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Data de Criação',
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString('pt-BR') : '-',
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: Profile) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row)}
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const handleOpenModal = () => {
    setEditingProfile(null);
    setFormData({
      id: '',
      full_name: '',
      phone: '',
      role: 'viewer',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      id: profile.id || '',
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      role: profile.role || 'viewer',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      await deleteProfile(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const profileData: any = {
      full_name: formData.full_name || null,
      phone: formData.phone || null,
      role: formData.role,
    };

    if (editingProfile) {
      await updateProfile(editingProfile.id, profileData);
    } else {
      // Para criar um novo perfil, precisamos do ID do usuário do auth
      if (!formData.id) {
        alert('Para criar um novo perfil, é necessário o ID do usuário do sistema de autenticação.');
        return;
      }
      await createProfile({ ...profileData, id: formData.id });
    }

    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="page">Carregando...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Usuários</h1>
          <p className="page-subtitle">Gerencie os perfis de usuários</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus size={18} />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={profiles}
          emptyMessage="Nenhum usuário cadastrado"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProfile ? 'Editar Usuário' : 'Novo Usuário'}
        size="md"
      >
        <form className="form" onSubmit={handleSubmit}>
          {!editingProfile && (
            <Input
              label="ID do Usuário (Auth)"
              placeholder="UUID do usuário no sistema de autenticação"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required={!editingProfile}
            />
          )}

          <Input
            label="Nome Completo"
            placeholder="Nome completo do usuário"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />

          <Input
            label="Telefone"
            placeholder="(00) 00000-0000"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Select
            label="Papel"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            options={[
              { value: 'admin', label: 'Administrador' },
              { value: 'agent', label: 'Agente' },
              { value: 'viewer', label: 'Visualizador' },
            ]}
          />

          <div className="form-actions">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
