import { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import './Neighborhoods.css';

interface Neighborhood {
  id: string;
  name: string;
  city_id: string;
  created_at: string;
}

export default function Neighborhoods() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [neighborhoods] = useState<Neighborhood[]>([]);
  const [cities] = useState<{ id: string; name: string }[]>([]);

  const columns = [
    { key: 'name', label: 'Nome do Bairro' },
    {
      key: 'city_id',
      label: 'Cidade',
      render: (value: string) => {
        const city = cities.find((c) => c.id === value);
        return city ? city.name : '-';
      },
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
          <h1 className="page-title">Bairros</h1>
          <p className="page-subtitle">Gerencie os bairros por cidade</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Novo Bairro</Button>
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
        title="Novo Bairro"
        size="sm"
      >
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
          }}
        >
          <Input label="Nome do Bairro" placeholder="Ex: Centro" required />

          <Select
            label="Cidade"
            options={[
              { value: '', label: 'Selecione uma cidade' },
              ...cities.map((city) => ({
                value: city.id,
                label: city.name,
              })),
            ]}
            required
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

