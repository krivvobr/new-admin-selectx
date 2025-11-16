import { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Textarea from '../components/UI/Textarea';
import { useLeads } from '../hooks/useLeads';
import { useProperties } from '../hooks/useProperties';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Lead, LeadStatus } from '../types';
import './Leads.css';

export default function Leads() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'new' as LeadStatus,
    property_id: '',
    message: '',
    notes: '',
    property_url: '',
  });

  const { leads, loading, createLead, updateLead, deleteLead } = useLeads();
  const { properties } = useProperties();

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'phone', label: 'Telefone' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`badge badge-${value}`}>{value}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Data',
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString('pt-BR') : '-',
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: Lead) => (
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
    setEditingLead(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      status: 'new',
      property_id: '',
      message: '',
      notes: '',
      property_url: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      status: lead.status || 'new',
      property_id: lead.property_id || '',
      message: lead.message || '',
      notes: lead.notes || '',
      property_url: lead.property_url || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lead?')) {
      await deleteLead(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const leadData: any = {
      name: formData.name,
      phone: formData.phone || null,
      email: formData.email || null,
      status: formData.status,
      property_id: formData.property_id || null,
      message: formData.message || null,
      notes: formData.notes || null,
      property_url: formData.property_url || null,
    };

    if (editingLead) {
      await updateLead(editingLead.id, leadData);
    } else {
      await createLead(leadData);
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
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">Gerencie os leads de clientes</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus size={18} />
          Novo Lead
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={leads}
          emptyMessage="Nenhum lead cadastrado"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLead ? 'Editar Lead' : 'Novo Lead'}
        size="md"
      >
        <form className="form" onSubmit={handleSubmit}>
          <Input
            label="Nome"
            placeholder="Nome completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="form-row">
            <Input
              label="Telefone"
              placeholder="(00) 00000-0000"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Email"
              placeholder="email@exemplo.com"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-row">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
              options={[
                { value: 'new', label: 'Novo' },
                { value: 'contacted', label: 'Contactado' },
              ]}
            />
            <Select
              label="Propriedade"
              value={formData.property_id}
              onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
              options={[
                { value: '', label: 'Nenhuma' },
                ...properties.map((prop) => ({
                  value: prop.id,
                  label: `${prop.code} - ${prop.title}`,
                })),
              ]}
            />
          </div>

          <Textarea
            label="Mensagem"
            placeholder="Mensagem do lead"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <Textarea
            label="Notas"
            placeholder="Notas internas sobre o lead"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <Input
            label="URL da Propriedade"
            placeholder="https://..."
            value={formData.property_url}
            onChange={(e) => setFormData({ ...formData, property_url: e.target.value })}
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
