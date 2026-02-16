import React, { useState, useEffect } from 'react';
import { X, Upload, Star, Trash2 } from 'lucide-react';
import { useStore, type Product, type Gender } from '../context/StoreContext';
import { toast } from 'sonner';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const ProductFormModal = ({ isOpen, onClose, product }: ProductFormModalProps) => {
  const { addProduct, updateProduct, styles } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gender: 'homme' as Gender,
    style: '',
    price: 0,
    costPrice: 0,
    isActive: true,
    isFeatured: false,
  });

  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: number }>({});
  const [images, setImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        gender: product.gender,
        style: product.style,
        price: product.price,
        costPrice: product.costPrice,
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
      });

      const sizesMap: { [key: string]: number } = {};
      product.sizes.forEach(s => {
        sizesMap[s.size] = s.stock;
      });
      setSelectedSizes(sizesMap);

      setImages(product.images || [product.image]);
      setMainImageIndex(product.mainImageIndex || 0);
    } else {
      // Reset for new product
      setFormData({
        name: '',
        description: '',
        gender: 'homme',
        style: styles[0]?.slug || '',
        price: 0,
        costPrice: 0,
        isActive: true,
        isFeatured: false,
      });
      setSelectedSizes({});
      setImages([]);
      setMainImageIndex(0);
    }
  }, [product, isOpen, styles]);

  const margin = formData.price - formData.costPrice;
  const marginPercentage = formData.costPrice > 0 ? ((margin / formData.costPrice) * 100).toFixed(1) : '0';

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => {
      const newSizes = { ...prev };
      if (newSizes[size] !== undefined) {
        delete newSizes[size];
      } else {
        newSizes[size] = 0;
      }
      return newSizes;
    });
  };

  const handleSizeStockChange = (size: string, stock: number) => {
    setSelectedSizes(prev => ({
      ...prev,
      [size]: Math.max(0, stock)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulate image upload - in real app would upload to server/storage
      const fileReaders = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders).then(newImages => {
        setImages(prev => [...prev, ...newImages]);
        toast.success(`${newImages.length} image(s) ajoutée(s)`);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex >= images.length - 1) {
      setMainImageIndex(Math.max(0, images.length - 2));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Le nom du produit est obligatoire');
      return;
    }

    if (!formData.style) {
      toast.error('Veuillez sélectionner un style');
      return;
    }

    if (Object.keys(selectedSizes).length === 0) {
      toast.error('Veuillez sélectionner au moins une taille');
      return;
    }

    if (images.length === 0) {
      toast.error('Veuillez ajouter au moins une image');
      return;
    }

    if (formData.price <= 0 || formData.costPrice <= 0) {
      toast.error('Les prix doivent ��tre supérieurs à 0');
      return;
    }

    const productData = {
      ...formData,
      sizes: Object.entries(selectedSizes).map(([size, stock]) => ({ size, stock })),
      image: images[mainImageIndex],
      images,
      mainImageIndex,
    };

    if (product) {
      updateProduct(product.id, productData);
      toast.success('Produit modifié avec succès');
    } else {
      addProduct(productData);
      toast.success('Produit créé avec succès');
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="glass-card rounded-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/40 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl">
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 flex-1">
            {/* Section 1 - Informations générales */}
            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="w-6 h-6 sm:w-7 sm:h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm shadow-lg">1</span>
                Informations générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm mb-2">
                    Nom du produit <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base"
                    placeholder="Ex: T-Shirt Premium..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm mb-2">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="glass-input w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl resize-none text-sm sm:text-base"
                    placeholder="Description du produit..."
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm mb-2">
                    Genre <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="glass-input w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base"
                  >
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm mb-2">
                    Style <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    className="glass-input w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base"
                    required
                  >
                    <option value="">Sélectionner un style</option>
                    {styles.map(style => (
                      <option key={style.id} value={style.slug}>
                        {style.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2 - Tailles & Stock */}
            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="w-6 h-6 sm:w-7 sm:h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm shadow-lg">2</span>
                Tailles & Stock
              </h3>
              <div className="space-y-2 sm:space-y-2.5">
                {AVAILABLE_SIZES.map(size => (
                  <div key={size} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="flex items-center gap-2 cursor-pointer min-w-[70px] sm:min-w-[80px]">
                      <input
                        type="checkbox"
                        checked={selectedSizes[size] !== undefined}
                        onChange={() => handleSizeToggle(size)}
                        className="w-4 h-4 text-orange-600 rounded accent-orange-600"
                      />
                      <span className="font-medium text-sm sm:text-base">{size}</span>
                    </label>
                    
                    {selectedSizes[size] !== undefined && (
                      <div className="flex-1 max-w-full sm:max-w-xs ml-6 sm:ml-0">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={selectedSizes[size]}
                            onChange={(e) => handleSizeStockChange(size, parseInt(e.target.value) || 0)}
                            className="glass-input w-full px-3 py-1.5 sm:py-2 rounded-xl text-sm sm:text-base"
                            placeholder="Stock"
                          />
                          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">unités</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3 - Prix & Bénéfices */}
            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="w-6 h-6 sm:w-7 sm:h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm shadow-lg">3</span>
                Prix & Bénéfices
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm mb-2">
                    Prix d'achat (FCFA) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.costPrice || ''}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="glass-input w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm mb-2">
                    Prix de vente (FCFA) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="glass-input w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base"
                    placeholder="0"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-1">
                  <label className="block text-xs sm:text-sm mb-2">Marge bénéficiaire</label>
                  <div className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl backdrop-blur-sm border-2 ${
                    margin > 0 ? 'border-green-500/40 bg-green-500/20' : 'glass-input'
                  }`}>
                    <div className={`font-medium text-sm sm:text-base ${margin > 0 ? 'text-green-700' : 'text-gray-700'}`}>
                      {margin.toLocaleString()} F
                    </div>
                    <div className="text-xs text-gray-600">
                      {marginPercentage}% de marge
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 - Images du produit */}
            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="w-6 h-6 sm:w-7 sm:h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm shadow-lg">4</span>
                Images du produit
              </h3>

              {/* Upload Zone */}
              <div className="mb-4">
                <label className="block cursor-pointer">
                  <div className="glass-button border-2 border-dashed border-white/60 rounded-2xl p-4 sm:p-6 hover:border-orange-600/60 hover:bg-orange-500/10 transition-all text-center">
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      Cliquez pour ajouter des images
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG jusqu'à 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-3">
                    Cliquez sur l'étoile pour définir l'image principale
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          mainImageIndex === index ? 'border-orange-600 shadow-lg shadow-orange-500/30' : 'glass-button border-white/60'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Actions Overlay */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setMainImageIndex(index)}
                            className={`p-1 sm:p-1.5 rounded-lg shadow-lg ${
                              mainImageIndex === index ? 'bg-orange-600' : 'glass-button'
                            }`}
                          >
                            <Star
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                mainImageIndex === index ? 'text-white fill-white' : 'text-gray-700'
                              }`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1 sm:p-1.5 bg-red-600 rounded-lg shadow-lg"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </button>
                        </div>

                        {/* Main Badge */}
                        {mainImageIndex === index && (
                          <div className="absolute top-1 left-1 bg-orange-600 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-lg shadow-lg">
                            Principale
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 5 - Visibilité */}
            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="w-6 h-6 sm:w-7 sm:h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm shadow-lg">5</span>
                Visibilité
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center justify-between cursor-pointer p-3 glass-button rounded-xl hover:bg-orange-500/10 transition-all">
                  <div>
                    <div className="font-medium text-xs sm:text-sm">Produit actif</div>
                    <div className="text-xs text-gray-600">
                      Visible dans le catalogue
                    </div>
                  </div>
                  <div className="relative flex-shrink-0 ml-3">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/60 backdrop-blur-sm rounded-full peer-checked:bg-orange-600 transition-colors shadow-inner"></div>
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 glass-button rounded-xl hover:bg-orange-500/10 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded accent-orange-600 flex-shrink-0"
                  />
                  <div>
                    <div className="font-medium text-xs sm:text-sm">Produit mis en avant</div>
                    <div className="text-xs text-gray-600">
                      Afficher dans la section nouveautés
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex-shrink-0 border-t border-white/40 p-4 sm:p-6 bg-white/30 backdrop-blur-sm">
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 glass-button px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:scale-105 transition-transform text-sm sm:text-base"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm sm:text-base"
              >
                {product ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};