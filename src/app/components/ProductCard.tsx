import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../context/StoreContext';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { styles } = useStore();
  const availableStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
  const styleName = styles.find(s => s.slug === product.style)?.name || product.style;
  
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:scale-[1.02]">
        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-gray-50/50 to-gray-100/50 overflow-hidden relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.isFeatured && (
            <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
              Nouveau
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm sm:text-base line-clamp-2 text-gray-800 flex-1">{product.name}</h3>
            <span className="text-sm sm:text-base text-orange-600 shrink-0 font-semibold whitespace-nowrap">{product.price.toLocaleString()} F</span>
          </div>
          
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-gray-700 truncate max-w-[120px]">{styleName}</span>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-gray-700 capitalize">{product.gender}</span>
          </div>

          {availableStock <= 5 && availableStock > 0 && (
            <p className="mt-2 text-xs text-orange-600 font-medium">Plus que {availableStock} en stock</p>
          )}
          {availableStock === 0 && (
            <p className="mt-2 text-xs text-red-600 font-medium">Rupture de stock</p>
          )}
        </div>
      </div>
    </Link>
  );
};