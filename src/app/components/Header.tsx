import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header = () => {
  const { cart, isAdmin } = useStore();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (isAdminRoute && location.pathname !== '/admin/login') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="glass rounded-3xl shadow-2xl shadow-black/10 max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-orange-600 text-2xl">ROUKI</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/catalog?gender=homme" className="text-gray-700 hover:text-orange-600 transition-colors">
                Homme
              </Link>
              <Link to="/catalog?gender=femme" className="text-gray-700 hover:text-orange-600 transition-colors">
                Femme
              </Link>
              <Link to="/catalog" className="text-gray-700 hover:text-orange-600 transition-colors">
                Tous les styles
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative p-2 hover:bg-white/50 rounded-full transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              {isAdmin ? (
                <Link to="/admin/dashboard" className="p-2 hover:bg-white/50 rounded-full transition-colors">
                  <User className="w-6 h-6 text-orange-600" />
                </Link>
              ) : (
                <Link to="/admin/login" className="p-2 hover:bg-white/50 rounded-full transition-colors">
                  <User className="w-6 h-6 text-gray-700" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden border-t border-white/40 px-4 py-3 flex gap-4">
          <Link to="/catalog?gender=homme" className="flex-1 text-center py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors">
            Homme
          </Link>
          <Link to="/catalog?gender=femme" className="flex-1 text-center py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors">
            Femme
          </Link>
          <Link to="/catalog" className="flex-1 text-center py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors">
            Styles
          </Link>
        </nav>
      </div>
    </header>
  );
};