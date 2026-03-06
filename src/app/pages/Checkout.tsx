import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, createOrder } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    note: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newOrderId = await createOrder(formData);
    setOrderId(newOrderId);
    setOrderPlaced(true);
    setLoading(false);
  };

  if (cart.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl mb-2">Commande confirmée !</h2>
            <p className="text-gray-600 mb-6">
              Merci pour votre commande. L'équipe ROUKI vous contactera très bientôt pour organiser la livraison.
            </p>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/40">
              <p className="text-sm text-gray-600 mb-1">Numéro de commande</p>
              <p className="text-lg font-semibold text-orange-600">{orderId}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au panier
        </button>

        <h1 className="text-3xl mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6">
              <h3 className="text-xl mb-6">Informations de livraison</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">
                    Nom complet <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input w-full px-4 py-3 rounded-xl"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Numéro de téléphone <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="glass-input w-full px-4 py-3 rounded-xl"
                    placeholder="+228 XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Ville / Quartier (optionnel)</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="glass-input w-full px-4 py-3 rounded-xl"
                    placeholder="Ex: Lomé, Hédzranawoé"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Note (optionnel)</label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    rows={3}
                    className="glass-input w-full px-4 py-3 rounded-xl resize-none"
                    placeholder="Instructions de livraison, préférences..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30 transition-all mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Validation en cours...
                  </>
                ) : (
                  'Valider la commande'
                )}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h3 className="mb-4">Votre commande</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-white/40">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>{(item.product.price * item.quantity).toLocaleString()} F</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-lg mb-6">
                <span>Total</span>
                <span className="text-orange-600 font-semibold">{total.toLocaleString()} F</span>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-900">
                  <span className="text-orange-600">💰</span> Paiement à la livraison
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Vous payez en espèces lors de la réception de votre commande
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};