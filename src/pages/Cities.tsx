import { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import { useCities } from '../hooks/useCities';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { City } from '../types';
import './Cities.css';

export default function Cities() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
  });

  const { cities, loading, createCity, updateCity, deleteCity } = useCities();

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'state', label: 'Estado (UF)' },
    {
      key: 'created_at',
      label: 'Data de Criação',
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString('pt-BR') : '-',
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: City) => (
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
    setEditingCity(null);
    setFormData({ name: '', state: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name || '',
      state: city.state || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta cidade?')) {
      await deleteCity(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cityData = {
      name: formData.name,
      state: formData.state.toUpperCase(),
    };

    if (editingCity) {
      await updateCity(editingCity.id, cityData);
    } else {
      await createCity(cityData);
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
          <h1 className="page-title">Cidades</h1>
          <p className="page-subtitle">Gerencie as cidades disponíveis</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus size={18} />
          Nova Cidade
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={cities}
          emptyMessage="Nenhuma cidade cadastrada"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCity ? 'Editar Cidade' : 'Nova Cidade'}
        size="sm"
      >
        <form className="form" onSubmit={handleSubmit}>
          <Input
            label="Nome da Cidade"
            placeholder="Ex: São Paulo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Estado (UF)"
            placeholder="Ex: SP"
            maxLength={2}
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
            required
            style={{ textTransform: 'uppercase' }}
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
