import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity } = useStore();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 flex items-center justify-center">
        <div className="text-center glass-card p-12 rounded-2xl mx-4">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Votre panier est vide</h2>
          <p className="text-gray-600 mb-6">Ajoutez des produits pour commencer</p>
          <button
            onClick={() => navigate('/catalog')}
            className="glass-button text-orange-600 px-6 py-3 rounded-xl hover:scale-105 transition-transform"
          >
            Découvrir la collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continuer mes achats
        </button>

        <h1 className="text-3xl mb-8">Mon panier ({cart.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="glass-card rounded-2xl p-4 flex gap-3 sm:gap-4 hover:shadow-lg transition-shadow">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base mb-1 truncate">{item.product.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Taille: {item.size}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-white/50 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-sm sm:text-base text-orange-600 font-medium">{item.product.price.toLocaleString()} F</p>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="glass-button w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:scale-110 transition-transform font-semibold text-sm"
                      >
                        -
                      </button>
                      <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="glass-button w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:scale-110 transition-transform font-semibold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="text-base sm:text-lg mb-4">Récapitulatif</h3>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-white/40 max-h-[200px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 truncate pr-2">
                      {item.quantity}x {item.product.name} ({item.size})
                    </span>
                    <span className="flex-shrink-0">{(item.product.price * item.quantity).toLocaleString()} F</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-base sm:text-lg mb-4 sm:mb-6">
                <span>Total</span>
                <span className="text-orange-600 font-semibold">{total.toLocaleString()} F</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-orange-600 text-white py-3 sm:py-4 rounded-xl hover:bg-orange-700 transition-all hover:shadow-lg hover:shadow-orange-500/30 mb-2 sm:mb-3 text-sm sm:text-base"
              >
                Confirmer la commande
              </button>

              <p className="text-xs text-gray-600 text-center">
                Paiement à la livraison
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};