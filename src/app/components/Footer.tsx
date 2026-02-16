import React from 'react';
import { Facebook, Instagram, Phone, Mail } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  if (isAdminRoute) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-orange-600 text-xl mb-4">ROUKI</h3>
            <p className="text-gray-400 text-sm">
              Votre boutique de vêtements moderne au Togo. 
              Streetwear, Casual et Corporate pour hommes et femmes.
            </p>
            <div className="mt-4 bg-orange-600/10 border border-orange-600/30 rounded-3xl p-3">
              <p className="text-orange-600 text-sm">
                ✓ Paiement à la livraison
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3">Contact</h4>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Mail className="w-4 h-4" />
              <span>contact@roukii.fr</span>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; 2024 ROUKI. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};