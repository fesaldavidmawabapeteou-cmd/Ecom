import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { OrderStatus } from '../../context/StoreContext';

export const AdminOrders = () => {
  const { orders, updateOrderStatus } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    delivering: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels: Record<OrderStatus, string> = {
    pending: 'En attente de contact',
    confirmed: 'Confirmée',
    delivering: 'En livraison',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };

  const selectedOrderDetails = orders.find(o => o.id === selectedOrder);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl mb-6 md:mb-8">Gestion des commandes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List - Desktop Table */}
        <div className="hidden lg:block lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 border-b border-white/40">
                <tr>
                  <th className="text-left py-4 px-6 text-sm text-gray-600">ID</th>
                  <th className="text-left py-4 px-6 text-sm text-gray-600">Client</th>
                  <th className="text-left py-4 px-6 text-sm text-gray-600">Téléphone</th>
                  <th className="text-right py-4 px-6 text-sm text-gray-600">Total</th>
                  <th className="text-center py-4 px-6 text-sm text-gray-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order.id)}
                    className={`
                      border-b border-white/20 cursor-pointer transition-colors
                      ${selectedOrder === order.id ? 'bg-orange-100/50' : 'hover:bg-white/40'}
                    `}
                  >
                    <td className="py-4 px-6 text-sm">{order.id}</td>
                    <td className="py-4 px-6">{order.customerName}</td>
                    <td className="py-4 px-6 text-sm">{order.phone}</td>
                    <td className="py-4 px-6 text-right">{order.total.toLocaleString()} F</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders List - Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {orders.map(order => (
            <div 
              key={order.id}
              onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
              className={`glass-card rounded-2xl p-4 cursor-pointer transition-all ${
                selectedOrder === order.id ? 'ring-2 ring-orange-600 bg-orange-50/50' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">ID: {order.id}</p>
                  <p className="font-medium truncate">{order.customerName}</p>
                  <p className="text-sm text-gray-600 mt-1">{order.phone}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs flex-shrink-0 ml-2 ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-white/30">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-semibold text-orange-600">{order.total.toLocaleString()} F</span>
              </div>

              {/* Mobile Details Expanded */}
              {selectedOrder === order.id && (
                <div className="mt-4 pt-4 border-t border-white/30 space-y-3 animate-in fade-in duration-200">
                  {order.city && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Ville</p>
                      <p className="text-sm">{order.city}</p>
                    </div>
                  )}
                  
                  {order.note && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Note</p>
                      <p className="text-sm bg-white/60 backdrop-blur-sm p-2 rounded-lg border border-white/40">{order.note}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Articles</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-white/40 p-2 rounded-lg">
                          <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{item.product.name}</p>
                            <p className="text-xs text-gray-600">Taille {item.size} × {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Changer le statut</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="pending">En attente de contact</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="delivering">En livraison</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center text-gray-500">
              <p>Aucune commande pour le moment</p>
            </div>
          )}
        </div>

        {/* Order Details - Desktop Only */}
        <div className="hidden lg:block lg:col-span-1">
          {selectedOrderDetails ? (
            <div className="glass-card rounded-2xl p-6 sticky top-8">
              <h3 className="text-xl mb-4">Détails de la commande</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Client</p>
                  <p className="font-medium">{selectedOrderDetails.customerName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                  <p className="font-medium">{selectedOrderDetails.phone}</p>
                </div>

                {selectedOrderDetails.city && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ville</p>
                    <p className="font-medium">{selectedOrderDetails.city}</p>
                  </div>
                )}

                {selectedOrderDetails.note && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Note</p>
                    <p className="text-sm bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white/40">{selectedOrderDetails.note}</p>
                  </div>
                )}

                <div className="border-t border-white/40 pt-4">
                  <p className="text-sm text-gray-600 mb-3">Articles</p>
                  <div className="space-y-2">
                    {selectedOrderDetails.items.map((item, idx) => (
                      <div key={idx} className="text-sm flex justify-between bg-white/50 p-2 rounded-lg">
                        <span>{item.quantity}x {item.product.name} ({item.size})</span>
                        <span className="font-medium">{(item.product.price * item.quantity).toLocaleString()} F</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/40 pt-4">
                  <div className="flex justify-between text-lg">
                    <span>Total</span>
                    <span className="text-orange-600 font-semibold">{selectedOrderDetails.total.toLocaleString()} F</span>
                  </div>
                </div>

                <div className="border-t border-white/40 pt-4">
                  <p className="text-sm text-gray-600 mb-2">Changer le statut</p>
                  <select
                    value={selectedOrderDetails.status}
                    onChange={(e) => updateOrderStatus(selectedOrderDetails.id, e.target.value as OrderStatus)}
                    className="glass-input w-full px-4 py-2 rounded-xl"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-center text-gray-500">
              Sélectionnez une commande pour voir les détails
            </div>
          )}
        </div>
      </div>
    </div>
  );
};