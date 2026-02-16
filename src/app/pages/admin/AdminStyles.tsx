import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { toast } from 'sonner';

export const AdminStyles = () => {
  const { styles, products, addStyle, updateStyle, deleteStyle } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingStyle, setEditingStyle] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  const handleOpenModal = (styleId?: string) => {
    if (styleId) {
      const style = styles.find(s => s.id === styleId);
      if (style) {
        setFormData({
          name: style.name,
          slug: style.slug,
          description: style.description || ''
        });
        setEditingStyle(styleId);
      }
    } else {
      setFormData({ name: '', slug: '', description: '' });
      setEditingStyle(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStyle(null);
    setFormData({ name: '', slug: '', description: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug) {
      toast.error('Le nom et le slug sont obligatoires');
      return;
    }

    // Generate slug from name if empty
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');

    if (editingStyle) {
      updateStyle(editingStyle, { ...formData, slug });
      toast.success('Style modifié avec succès');
    } else {
      addStyle({ ...formData, slug });
      toast.success('Style créé avec succès');
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const productsWithStyle = products.filter(p => p.style === styles.find(s => s.id === id)?.slug);
    
    if (productsWithStyle.length > 0) {
      toast.error(`Impossible de supprimer ce style. ${productsWithStyle.length} produit(s) l'utilisent encore.`);
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce style ?')) {
      deleteStyle(id);
      toast.success('Style supprimé avec succès');
    }
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase()
        .replace(/[éèê]/g, 'e')
        .replace(/[àâ]/g, 'a')
        .replace(/[îï]/g, 'i')
        .replace(/[ôö]/g, 'o')
        .replace(/[ùûü]/g, 'u')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
    }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Gestion des styles</h1>
          <p className="text-sm md:text-base text-gray-600">{styles.length} style(s) disponible(s)</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-orange-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Ajouter un style
        </button>
      </div>

      {/* Styles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {styles.map(style => {
          const styleProducts = products.filter(p => p.style === style.slug);
          return (
            <div key={style.id} className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{style.name}</h3>
                  <p className="text-sm text-gray-600">{style.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(style.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-white/50"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(style.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-white/50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {style.description && (
                <p className="text-sm text-gray-600 mb-3 bg-white/50 p-3 rounded-xl">{style.description}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-white/40">
                <span className="text-sm text-gray-500">{styleProducts.length} produit(s)</span>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  styleProducts.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {styleProducts.length > 0 ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          );
        })}

        {styles.length === 0 && (
          <div className="col-span-full glass-card rounded-2xl p-12 text-center text-gray-500">
            Aucun style pour le moment. Cliquez sur "Ajouter un style" pour commencer.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl max-w-lg w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl">
                {editingStyle ? 'Modifier le style' : 'Nouveau style'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/50 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">
                  Nom du style <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl"
                  placeholder="Ex: Streetwear, Casual..."
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  Slug <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="glass-input w-full px-4 py-2.5 rounded-xl"
                  placeholder="streetwear"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Utilisé dans l'URL (généré automatiquement à partir du nom)
                </p>
              </div>

              <div>
                <label className="block text-sm mb-2">Description (optionnel)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="glass-input w-full px-4 py-2.5 rounded-xl resize-none"
                  placeholder="Description du style..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 glass-button px-6 py-2.5 rounded-xl hover:scale-105 transition-transform"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  {editingStyle ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};