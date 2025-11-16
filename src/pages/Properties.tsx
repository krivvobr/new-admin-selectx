import { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Textarea from '../components/UI/Textarea';
import { useProperties } from '../hooks/useProperties';
import { useCities } from '../hooks/useCities';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Property, PropertyType, PropertyPurpose, PropertyStatus } from '../types';
import './Properties.css';

export default function Properties() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    type: 'apartamento' as PropertyType,
    purpose: 'venda' as PropertyPurpose,
    price: '',
    address: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    furnished: false,
    financing: false,
    floor: '',
    status: 'disponivel' as PropertyStatus,
    city_id: '',
    suites: '',
    cover_image: '',
  });

  const { properties, loading, createProperty, updateProperty, deleteProperty } = useProperties();
  const { cities } = useCities();

  const columns = [
    { key: 'code', label: 'Código' },
    { key: 'title', label: 'Título' },
    {
      key: 'type',
      label: 'Tipo',
      render: (value: string) => (
        <span className="badge badge-type">{value}</span>
      ),
    },
    {
      key: 'purpose',
      label: 'Finalidade',
      render: (value: string) => (
        <span className="badge badge-purpose">{value}</span>
      ),
    },
    {
      key: 'price',
      label: 'Preço',
      render: (value: number) =>
        value ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`badge badge-${value}`}>{value}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: Property) => (
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
    setEditingProperty(null);
    setFormData({
      code: '',
      title: '',
      description: '',
      type: 'apartamento',
      purpose: 'venda',
      price: '',
      address: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      parking: '',
      furnished: false,
      financing: false,
      floor: '',
      status: 'disponivel',
      city_id: '',
      suites: '',
      cover_image: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      code: property.code || '',
      title: property.title || '',
      description: property.description || '',
      type: property.type || 'apartamento',
      purpose: property.purpose || 'venda',
      price: property.price?.toString() || '',
      address: property.address || '',
      area: property.area?.toString() || '',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      parking: property.parking?.toString() || '',
      furnished: property.furnished || false,
      financing: property.financing || false,
      floor: property.floor?.toString() || '',
      status: property.status || 'disponivel',
      city_id: property.city_id || '',
      suites: property.suites?.toString() || '',
      cover_image: property.cover_image || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta propriedade?')) {
      await deleteProperty(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const propertyData: any = {
      code: formData.code,
      title: formData.title,
      description: formData.description || null,
      type: formData.type,
      purpose: formData.purpose,
      price: formData.price ? parseFloat(formData.price) : null,
      address: formData.address || null,
      area: formData.area ? parseFloat(formData.area) : null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      parking: formData.parking ? parseInt(formData.parking) : null,
      furnished: formData.furnished,
      financing: formData.financing,
      floor: formData.floor ? parseInt(formData.floor) : null,
      status: formData.status,
      city_id: formData.city_id || null,
      suites: formData.suites ? parseInt(formData.suites) : null,
      cover_image: formData.cover_image || null,
    };

    if (editingProperty) {
      await updateProperty(editingProperty.id, propertyData);
    } else {
      await createProperty(propertyData);
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
          <h1 className="page-title">Propriedades</h1>
          <p className="page-subtitle">Gerencie todas as propriedades do sistema</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus size={18} />
          Nova Propriedade
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={properties}
          emptyMessage="Nenhuma propriedade cadastrada"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProperty ? 'Editar Propriedade' : 'Nova Propriedade'}
        size="lg"
      >
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <Input
              label="Código"
              placeholder="Ex: PROP001"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <Input
              label="Título"
              placeholder="Título da propriedade"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <Select
              label="Tipo"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
              options={[
                { value: 'apartamento', label: 'Apartamento' },
                { value: 'casa', label: 'Casa' },
                { value: 'cobertura', label: 'Cobertura' },
                { value: 'comercial', label: 'Comercial' },
                { value: 'terreno', label: 'Terreno' },
              ]}
              required
            />
            <Select
              label="Finalidade"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value as PropertyPurpose })}
              options={[
                { value: 'venda', label: 'Venda' },
                { value: 'locacao', label: 'Locação' },
              ]}
              required
            />
          </div>

          <div className="form-row">
            <Input
              label="Preço"
              type="number"
              placeholder="0.00"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
              options={[
                { value: 'disponivel', label: 'Disponível' },
                { value: 'vendido', label: 'Vendido' },
                { value: 'alugado', label: 'Alugado' },
                { value: 'inativo', label: 'Inativo' },
              ]}
            />
          </div>

          <Textarea
            label="Descrição"
            placeholder="Descrição da propriedade"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="form-row">
            <Input
              label="Endereço"
              placeholder="Endereço completo"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input
              label="Área (m²)"
              type="number"
              placeholder="0"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            />
          </div>

          <div className="form-row">
            <Input
              label="Quartos"
              type="number"
              placeholder="0"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
            />
            <Input
              label="Banheiros"
              type="number"
              placeholder="0"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
            />
            <Input
              label="Suítes"
              type="number"
              placeholder="0"
              value={formData.suites}
              onChange={(e) => setFormData({ ...formData, suites: e.target.value })}
            />
            <Input
              label="Vagas"
              type="number"
              placeholder="0"
              value={formData.parking}
              onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
            />
          </div>

          <div className="form-row">
            <Input
              label="Andar"
              type="number"
              placeholder="0"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
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
            />
          </div>

          <div className="form-row">
            <Input
              label="Imagem de Capa (URL)"
              placeholder="https://..."
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
            />
          </div>

          <div className="form-row">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={formData.furnished}
                onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
              />
              Mobiliada
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={formData.financing}
                onChange={(e) => setFormData({ ...formData, financing: e.target.checked })}
              />
              Aceita Financiamento
            </label>
          </div>

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
