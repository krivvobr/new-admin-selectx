import { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import { useNeighborhoods } from '../hooks/useNeighborhoods';
import { useCities } from '../hooks/useCities';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Neighborhood } from '../types';
import './Neighborhoods.css';

export default function Neighborhoods() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    city_id: '',
  });

  const { neighborhoods, loading, createNeighborhood, updateNeighborhood, deleteNeighborhood } = useNeighborhoods();
  const { cities } = useCities();

  const columns = [
    { key: 'name', label: 'Nome do Bairro' },
    {
      key: 'city_id',
      label: 'Cidade',
      render: (value: string) => {
        const city = cities.find((c) => c.id === value);
        return city ? `${city.name} - ${city.state}` : '-';
      },
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
      render: (_: any, row: Neighborhood) => (
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
    setEditingNeighborhood(null);
    setFormData({ name: '', city_id: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (neighborhood: Neighborhood) => {
    setEditingNeighborhood(neighborhood);
    setFormData({
      name: neighborhood.name || '',
      city_id: neighborhood.city_id || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este bairro?')) {
      await deleteNeighborhood(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const neighborhoodData = {
      name: formData.name,
      city_id: formData.city_id,
    };

    if (editingNeighborhood) {
      await updateNeighborhood(editingNeighborhood.id, neighborhoodData);
    } else {
      await createNeighborhood(neighborhoodData);
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
          <h1 className="page-title">Bairros</h1>
          <p className="page-subtitle">Gerencie os bairros por cidade</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus size={18} />
          Novo Bairro
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={neighborhoods}
          emptyMessage="Nenhum bairro cadastrado"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNeighborhood ? 'Editar Bairro' : 'Novo Bairro'}
        size="sm"
      >
        <form className="form" onSubmit={handleSubmit}>
          <Input
            label="Nome do Bairro"
            placeholder="Ex: Centro"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Cidade"
            value={formData.city_id}
            onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
            options={[
              { value: '', label: 'Selecione uma cidade' },
              ...cities.map((city) => ({
                value: city.id,
                label: `${city.name} - ${city.state}`,
              })),
            ]}
            required
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
