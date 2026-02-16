import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import { api } from '../../hooks/useApi';

export const AdminDashboard = () => {
  const { orders } = useStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await api.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentOrders = orders.slice(0, 5);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    delivering: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    delivering: 'En livraison',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl mb-6 md:mb-8">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="glass-card rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-1">Commandes reçues</p>
          <p className="text-xl md:text-2xl font-semibold">{stats?.totalOrders || 0}</p>
          <p className="text-xs text-gray-500 mt-1 md:mt-2">{stats?.pendingOrders || 0} en attente</p>
        </div>

        <div className="glass-card rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-1">Livrées</p>
          <p className="text-xl md:text-2xl font-semibold">{stats?.deliveredOrders || 0}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-1">Chiffre d'affaires</p>
          <p className="text-lg md:text-2xl font-semibold">{(stats?.totalRevenue || 0).toLocaleString()} F</p>
          <p className="text-xs text-gray-500 mt-1 md:mt-2">Livré</p>
        </div>

        <div className="glass-card rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-1">Bénéfices</p>
          <p className="text-lg md:text-2xl font-semibold">{(stats?.profit || 0).toLocaleString()} F</p>
          <p className="text-xs text-gray-500 mt-1 md:mt-2">Marge</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl">Dernières commandes</h2>
          <Link to="/admin/orders" className="text-orange-600 hover:text-orange-700 text-xs md:text-sm font-medium">
            Voir tout
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/40">
                    <th className="text-left py-3 text-sm text-gray-600">ID</th>
                    <th className="text-left py-3 text-sm text-gray-600">Client</th>
                    <th className="text-left py-3 text-sm text-gray-600">Téléphone</th>
                    <th className="text-right py-3 text-sm text-gray-600">Total</th>
                    <th className="text-center py-3 text-sm text-gray-600">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-white/20 hover:bg-white/30 transition-colors">
                      <td className="py-3 text-sm">{order.id}</td>
                      <td className="py-3">{order.customerName}</td>
                      <td className="py-3 text-sm text-gray-600">{order.phone}</td>
                      <td className="py-3 text-right">{order.total.toLocaleString()} F</td>
                      <td className="py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{order.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="font-medium mb-1">{order.customerName}</p>
                  <p className="text-sm text-gray-600 mb-2">{order.phone}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/30">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="font-semibold text-orange-600">{order.total.toLocaleString()} F</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-8 text-sm">Aucune commande pour le moment</p>
        )}
      </div>
    </div>
  );
};