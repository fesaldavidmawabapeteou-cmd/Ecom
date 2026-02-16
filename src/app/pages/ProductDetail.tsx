import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { toast } from 'sonner';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, styles, addToCart } = useStore();
  const product = products.find(p => p.id === id);

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 flex items-center justify-center">
        <div className="text-center glass-card p-12 rounded-2xl mx-4">
          <p className="text-gray-600 mb-4">Produit non trouvé</p>
          <button onClick={() => navigate('/catalog')} className="glass-button text-orange-600 px-6 py-3 rounded-xl">
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  const selectedSizeStock = product.sizes.find(s => s.size === selectedSize)?.stock || 0;
  const styleName = styles.find(s => s.slug === product.style)?.name || product.style;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Veuillez sélectionner une taille');
      return;
    }
    if (quantity > selectedSizeStock) {
      toast.error('Stock insuffisant');
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success('Produit ajouté au panier');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-gray-50/50 to-gray-100/50">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-xs sm:text-sm">{styleName}</span>
                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-xs sm:text-sm capitalize">{product.gender}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl mb-2">{product.name}</h1>
              <p className="text-xl sm:text-2xl text-orange-600 font-semibold">{product.price.toLocaleString()} F</p>
            </div>

            <p className="text-sm sm:text-base text-gray-600 mb-6">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm sm:text-base mb-3">Taille</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map(({ size, stock }) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={stock === 0}
                    className={`
                      px-3 py-2.5 rounded-xl transition-all font-medium text-sm sm:text-base
                      ${selectedSize === size 
                        ? 'border-2 border-orange-600 bg-orange-50 text-orange-600 scale-105' 
                        : 'glass-button hover:scale-105'}
                      ${stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="truncate">{size}</div>
                    {stock <= 3 && stock > 0 && (
                      <div className="text-xs text-orange-600 mt-0.5">({stock})</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            {selectedSize && (
              <div className="mb-6">
                <h3 className="text-sm sm:text-base mb-3">Quantité</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="glass-button w-10 h-10 sm:w-12 sm:h-12 rounded-xl hover:scale-110 transition-transform font-semibold text-lg"
                  >
                    -
                  </button>
                  <span className="w-12 sm:w-16 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
                    className="glass-button w-10 h-10 sm:w-12 sm:h-12 rounded-xl hover:scale-110 transition-transform font-semibold text-lg"
                  >
                    +
                  </button>
                  <span className="text-xs sm:text-sm text-gray-600 ml-2">
                    (Max: {selectedSizeStock})
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-600 text-white py-3 sm:py-4 rounded-xl hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 mb-4 text-sm sm:text-base"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              Ajouter au panier
            </button>

            {/* Payment Info */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">
                  <span className="text-orange-600 font-medium">Paiement à la livraison</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Vous payez au moment de recevoir votre commande
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};