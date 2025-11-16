import { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import './Cities.css';

interface City {
  id: string;
  name: string;
  state: string;
  created_at: string;
}

export default function Cities() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cities] = useState<City[]>([]);

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'state', label: 'Estado (UF)' },
    {
      key: 'created_at',
      label: 'Data de Criação',
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString('pt-BR') : '-',
    },
  ];

  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cidades</h1>
          <p className="page-subtitle">Gerencie as cidades disponíveis</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Nova Cidade</Button>
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
        title="Nova Cidade"
        size="sm"
      >
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
          }}
        >
          <Input label="Nome da Cidade" placeholder="Ex: São Paulo" required />

          <div className="form-row">
            <Input
              label="Estado (UF)"
              placeholder="Ex: SP"
              maxLength={2}
              required
              style={{ textTransform: 'uppercase' }}
            />
          </div>

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

