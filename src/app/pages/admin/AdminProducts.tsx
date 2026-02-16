import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductFormModal } from '../../components/ProductFormModal';
import { toast } from 'sonner';
import type { Product } from '../../context/StoreContext';

export const AdminProducts = () => {
  const { products, styles, deleteProduct } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(undefined);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      deleteProduct(product.id);
      toast.success('Produit supprimé avec succès');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Gestion des produits</h1>
          <p className="text-sm md:text-base text-gray-600">{products.length} produit(s) au total</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-orange-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Ajouter un produit
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50 border-b border-white/40">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Image</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Nom</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Genre</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Style</th>
                <th className="text-right py-4 px-6 text-sm text-gray-600">Prix achat</th>
                <th className="text-right py-4 px-6 text-sm text-gray-600">Prix vente</th>
                <th className="text-center py-4 px-6 text-sm text-gray-600">Stock</th>
                <th className="text-center py-4 px-6 text-sm text-gray-600">Statut</th>
                <th className="text-center py-4 px-6 text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
                const styleName = styles.find(s => s.slug === product.style)?.name || product.style;
                return (
                  <tr key={product.id} className="border-b border-white/20 hover:bg-white/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-16 h-16 object-cover rounded-xl" 
                        />
                        {product.isFeatured && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white text-xs">★</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate">{product.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 capitalize">{product.gender}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg text-sm">
                        {styleName}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">{product.costPrice.toLocaleString()} F</td>
                    <td className="py-4 px-6 text-right font-medium">{product.price.toLocaleString()} F</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        totalStock === 0 ? 'bg-red-100 text-red-800' :
                        totalStock <= 5 ? 'bg-orange-100 text-orange-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        product.isActive === false ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                      }`}>
                        {product.isActive === false ? 'Inactif' : 'Actif'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product)}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun produit pour le moment. Cliquez sur "Ajouter un produit" pour commencer.
          </div>
        )}
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden space-y-4">
        {products.length > 0 ? (
          products.map(product => {
            const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
            const styleName = styles.find(s => s.slug === product.style)?.name || product.style;
            
            return (
              <div key={product.id} className="glass-card rounded-2xl p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl" 
                    />
                    {product.isFeatured && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs">★</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium line-clamp-1">{product.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
                        product.isActive === false ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                      }`}>
                        {product.isActive === false ? 'Inactif' : 'Actif'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 line-clamp-1 mb-3">{product.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-xs capitalize">{product.gender}</span>
                      <span className="px-2 py-1 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-xs">{styleName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        totalStock === 0 ? 'bg-red-100 text-red-800' :
                        totalStock <= 5 ? 'bg-orange-100 text-orange-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        Stock: {totalStock}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-500">Achat: </span>
                        <span className="text-gray-700">{product.costPrice.toLocaleString()} F</span>
                        <span className="text-gray-400 mx-2">|</span>
                        <span className="text-gray-500">Vente: </span>
                        <span className="font-medium text-orange-600">{product.price.toLocaleString()} F</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/30">
                  <button 
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 glass-button rounded-xl text-blue-600 hover:scale-105 transition-transform text-sm"
                  >
                    <Pencil className="w-4 h-4" />
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 glass-button rounded-xl text-red-600 hover:scale-105 transition-transform text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center text-gray-500 text-sm">
            Aucun produit pour le moment. Cliquez sur "Ajouter un produit" pour commencer.
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductFormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        product={editingProduct}
      />
    </div>
  );
};