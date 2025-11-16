import { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Textarea from '../components/UI/Textarea';
import './Leads.css';

interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  status: string;
  created_at: string;
}

export default function Leads() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads] = useState<Lead[]>([]);

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
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">Gerencie os leads de clientes</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Novo Lead</Button>
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
        title="Novo Lead"
        size="md"
      >
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
          }}
        >
          <Input label="Nome" placeholder="Nome completo" required />

          <div className="form-row">
            <Input label="Telefone" placeholder="(00) 00000-0000" type="tel" />
            <Input label="Email" placeholder="email@exemplo.com" type="email" />
          </div>

          <Select
            label="Status"
            options={[
              { value: 'new', label: 'Novo' },
              { value: 'contacted', label: 'Contactado' },
            ]}
          />

          <Textarea label="Mensagem" placeholder="Mensagem do lead" />

          <Textarea label="Notas" placeholder="Notas internas sobre o lead" />

          <Input label="URL da Propriedade" placeholder="https://..." />

          <div className="form-actions">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

