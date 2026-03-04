import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Tag, Settings } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useStore();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Produits' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Commandes' },
    { path: '/admin/styles', icon: Tag, label: 'Styles' },
    { path: '/admin/stats', icon: BarChart3, label: 'Statistiques' },
    { path: '/admin/parameters', icon: Settings, label: 'Paramètres' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 glass flex-col border-r border-white/40 shadow-xl">
        <div className="p-6 border-b border-white/40">
          <h1 className="text-orange-600 text-2xl font-bold">ROUKI</h1>
          <p className="text-sm text-gray-600">Admin</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-3xl transition-all
                    ${isActive 
                      ? 'bg-orange-500/20 text-orange-600 backdrop-blur-sm border border-orange-500/30 shadow-lg' 
                      : 'text-gray-700 glass-button hover:scale-105'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation - Frozen Glass Floating */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl shadow-black/10">
          <div className="grid grid-cols-6 gap-0.5 sm:gap-1 px-2 sm:px-3 py-2 sm:py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'text-orange-600 bg-orange-500/10 scale-105' 
                      : 'text-orange-500/70 hover:text-orange-600 hover:bg-orange-500/5'}
                  `}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs truncate w-full text-center font-medium leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};