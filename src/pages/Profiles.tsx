import { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import { Plus } from 'lucide-react';
import './Profiles.css';

interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  role: string;
  created_at: string;
}

export default function Profiles() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profiles] = useState<Profile[]>([]);

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
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Usuários</h1>
          <p className="page-subtitle">Gerencie os perfis de usuários</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
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
        title="Novo Usuário"
        size="md"
      >
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
          }}
        >
          <Input label="Nome Completo" placeholder="Nome completo do usuário" />

          <Input label="Telefone" placeholder="(00) 00000-0000" type="tel" />

          <Select
            label="Papel"
            options={[
              { value: 'admin', label: 'Administrador' },
              { value: 'agent', label: 'Agente' },
              { value: 'viewer', label: 'Visualizador' },
            ]}
          />

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

