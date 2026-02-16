import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStore } from '../../context/StoreContext';

export const AdminStats = () => {
  const { orders, products } = useStore();

  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  
  // Sales by style
  const salesByStyle = products.reduce((acc, product) => {
    const productOrders = deliveredOrders.flatMap(order => 
      order.items.filter(item => item.product.id === product.id)
    );
    const totalSales = productOrders.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    acc[product.style] = (acc[product.style] || 0) + totalSales;
    return acc;
  }, {} as Record<string, number>);

  const styleData = Object.entries(salesByStyle).map(([style, sales]) => ({
    name: style,
    value: sales
  }));

  // Monthly revenue (mock data for demo)
  const monthlyData = [
    { month: 'Jan', revenue: 120000 },
    { month: 'Fév', revenue: 150000 },
    { month: 'Mar', revenue: 180000 },
    { month: 'Avr', revenue: 220000 },
    { month: 'Mai', revenue: 190000 },
    { month: 'Juin', revenue: 250000 }
  ];

  // Top products
  const productSales = products.map(product => {
    const productOrders = deliveredOrders.flatMap(order => 
      order.items.filter(item => item.product.id === product.id)
    );
    const quantity = productOrders.reduce((sum, item) => sum + item.quantity, 0);
    const revenue = productOrders.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    return { ...product, soldQuantity: quantity, revenue };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const COLORS = ['#FF6B00', '#FF8533', '#FFA366', '#FFBD99', '#FFD6CC'];

  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
  const profit = deliveredOrders.reduce((sum, order) => {
    const orderProfit = order.items.reduce((itemSum, item) => {
      const margin = item.product.price - item.product.costPrice;
      return itemSum + (margin * item.quantity);
    }, 0);
    return sum + orderProfit;
  }, 0);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl mb-6 md:mb-8">Statistiques</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-gray-600 text-sm mb-2">Chiffre d'affaires</p>
          <p className="text-2xl md:text-3xl text-orange-600 font-semibold">{totalRevenue.toLocaleString()} F</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-gray-600 text-sm mb-2">Bénéfice net</p>
          <p className="text-2xl md:text-3xl text-green-600 font-semibold">{profit.toLocaleString()} F</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-gray-600 text-sm mb-2">Marge moyenne</p>
          <p className="text-2xl md:text-3xl text-blue-600 font-semibold">
            {totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Month */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl mb-4">Évolution du chiffre d'affaires</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#FF6B00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Style */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl mb-4">Ventes par style</h3>
          {styleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={styleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {styleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl mb-4">Produits les plus vendus</h3>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50 border-b border-white/40">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Produit</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Quantité vendue</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Chiffre d'affaires</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Bénéfice</th>
              </tr>
            </thead>
            <tbody>
              {productSales.map(product => {
                const productProfit = product.soldQuantity * (product.price - product.costPrice);
                return (
                  <tr key={product.id} className="border-b border-white/20 hover:bg-white/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-center">{product.soldQuantity}</td>
                    <td className="py-3 px-4 text-right font-medium">{product.revenue.toLocaleString()} F</td>
                    <td className="py-3 px-4 text-right text-green-600 font-semibold">{productProfit.toLocaleString()} F</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {productSales.length > 0 ? (
            productSales.map(product => {
              const productProfit = product.soldQuantity * (product.price - product.costPrice);
              return (
                <div key={product.id} className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium flex-1 pr-2">{product.name}</h4>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs flex-shrink-0">
                      {product.soldQuantity} vendus
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Chiffre d'affaires</p>
                      <p className="font-semibold text-sm">{product.revenue.toLocaleString()} F</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bénéfice</p>
                      <p className="font-semibold text-sm text-green-600">{productProfit.toLocaleString()} F</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 text-sm py-4">Aucune donnée disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};