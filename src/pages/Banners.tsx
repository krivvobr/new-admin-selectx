import { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import ImageKitUpload from '../components/ImageKitUpload';
import { useBanners } from '../hooks/useBanners';
import type { Banner } from '../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import './Banners.css';

export default function Banners() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    active: true,
    desktop_images: [] as string[],
    mobile_image: '' as string,
  });

  const { banners, loading, createBanner, updateBanner, deleteBanner } = useBanners();

  const columns = [
    { key: 'title', label: 'Título' },
    {
      key: 'active',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`badge ${value ? 'badge-disponivel' : 'badge-inativo'}`}>{value ? 'Ativo' : 'Inativo'}</span>
      ),
    },
    {
      key: 'desktop_images',
      label: 'Imagens Desktop',
      render: (value: string[]) => (value?.length || 0),
    },
    {
      key: 'mobile_image',
      label: 'Imagem Mobile',
      render: (value: string | null) => (value ? '1' : '0'),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: unknown, row: Banner) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Edit size={14} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const handleOpenModal = () => {
    setEditingBanner(null);
    setFormData({ title: '', active: true, desktop_images: [], mobile_image: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      active: banner.active ?? true,
      desktop_images: banner.desktop_images || [],
      mobile_image: banner.mobile_image || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      await deleteBanner(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.title.trim()) {
      alert('Informe o título do banner');
      return;
    }

    const payload: { title: string; active: boolean; desktop_images: string[]; mobile_image?: string } = {
      title: formData.title.trim(),
      active: !!formData.active,
      desktop_images: formData.desktop_images || [],
      mobile_image: formData.mobile_image || undefined,
    };

    let result;
    if (editingBanner) {
      result = await updateBanner(editingBanner.id, payload);
    } else {
      result = await createBanner(payload);
    }
    if (result && 'error' in result && result.error) {
      alert(`Erro ao salvar banner: ${result.error}`);
      return;
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
          <h1 className="page-title">Banners</h1>
          <p className="page-subtitle">Gerencie os banners do slider do site</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus size={18} />
          Novo Banner
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={banners} emptyMessage="Nenhum banner cadastrado" />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Editar Banner' : 'Novo Banner'}
        size="lg"
      >
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <Input
              label="Título"
              placeholder="Título do banner"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              Ativo
            </label>
          </div>

          <div className="form-row" style={{ flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>
                Imagens Desktop (slider)
              </label>
              <ImageKitUpload
                folder="/banners"
                images={formData.desktop_images}
                onImagesChange={(images) => setFormData({ ...formData, desktop_images: images })}
                minImages={0}
                maxImages={10}
              />
            </div>
          </div>

          <div className="form-row" style={{ flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>
                Imagem Mobile (slider)
              </label>
              <ImageKitUpload
                folder="/banners"
                images={formData.mobile_image ? [formData.mobile_image] : []}
                onImagesChange={(images) => setFormData({ ...formData, mobile_image: images[0] || '' })}
                minImages={0}
                maxImages={1}
              />
            </div>
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