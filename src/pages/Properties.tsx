import { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Textarea from '../components/UI/Textarea';
import { Plus } from 'lucide-react';
import './Properties.css';

interface Property {
  id: string;
  code: string;
  title: string;
  type: string;
  purpose: string;
  price: number;
  status: string;
  city_id?: string;
}

export default function Properties() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties] = useState<Property[]>([]);

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
        value ? `R$ ${value.toLocaleString('pt-BR')}` : '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`badge badge-${value}`}>{value}</span>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Propriedades</h1>
          <p className="page-subtitle">Gerencie todas as propriedades do sistema</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
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
        title="Nova Propriedade"
        size="lg"
      >
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
          }}
        >
          <div className="form-row">
            <Input label="Código" placeholder="Ex: PROP001" required />
            <Input label="Título" placeholder="Título da propriedade" required />
          </div>

          <div className="form-row">
            <Select
              label="Tipo"
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
              required
            />
            <Select
              label="Status"
              options={[
                { value: 'disponivel', label: 'Disponível' },
                { value: 'vendido', label: 'Vendido' },
                { value: 'alugado', label: 'Alugado' },
                { value: 'inativo', label: 'Inativo' },
              ]}
            />
          </div>

          <Textarea label="Descrição" placeholder="Descrição da propriedade" />

          <div className="form-row">
            <Input label="Endereço" placeholder="Endereço completo" />
            <Input label="Área (m²)" type="number" placeholder="0" />
          </div>

          <div className="form-row">
            <Input label="Quartos" type="number" placeholder="0" />
            <Input label="Banheiros" type="number" placeholder="0" />
            <Input label="Suítes" type="number" placeholder="0" />
            <Input label="Vagas" type="number" placeholder="0" />
          </div>

          <div className="form-row">
            <Input label="Andar" type="number" placeholder="0" />
            <Input label="Imagem de Capa (URL)" placeholder="https://..." />
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

