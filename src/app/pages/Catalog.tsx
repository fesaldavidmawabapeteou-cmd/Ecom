import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import type { Gender } from '../context/StoreContext';

export const Catalog = () => {
  const { products, styles } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>(
    (searchParams.get('gender') as Gender) || 'all'
  );
  const [selectedStyle, setSelectedStyle] = useState<string>(
    searchParams.get('style') || 'all'
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params: any = {};
    if (selectedGender !== 'all') params.gender = selectedGender;
    if (selectedStyle !== 'all') params.style = selectedStyle;
    setSearchParams(params);
  }, [selectedGender, selectedStyle]);

  const filteredProducts = products.filter(product => {
    if (selectedGender !== 'all' && product.gender !== selectedGender) return false;
    if (selectedStyle !== 'all' && product.style !== selectedStyle) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2">Catalogue</h1>
            <p className="text-sm sm:text-base text-gray-600">{filteredProducts.length} produit(s)</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 glass-button px-4 py-2 rounded-xl relative"
          >
            <Filter className="w-4 h-4" />
            Filtres
            {(selectedGender !== 'all' || selectedStyle !== 'all') && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center">
                {(selectedGender !== 'all' ? 1 : 0) + (selectedStyle !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <aside className="hidden md:block md:w-64">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h3 className="mb-4">Filtres</h3>

              {/* Gender Filter */}
              <div className="mb-6">
                <h4 className="text-sm mb-3 text-gray-700">Genre</h4>
                <div className="space-y-2">
                  {(['all', 'homme', 'femme'] as const).map(gender => (
                    <label key={gender} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={selectedGender === gender}
                        onChange={() => setSelectedGender(gender)}
                        className="w-4 h-4 text-orange-600 accent-orange-600"
                      />
                      <span className="text-sm capitalize">
                        {gender === 'all' ? 'Tous' : gender}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Style Filter - Dynamic */}
              <div className="mb-6">
                <h4 className="text-sm mb-3 text-gray-700">Style</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="style"
                      checked={selectedStyle === 'all'}
                      onChange={() => setSelectedStyle('all')}
                      className="w-4 h-4 text-orange-600 accent-orange-600"
                    />
                    <span className="text-sm">Tous</span>
                  </label>
                  {styles.map(style => (
                    <label key={style.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="style"
                        checked={selectedStyle === style.slug}
                        onChange={() => setSelectedStyle(style.slug)}
                        className="w-4 h-4 text-orange-600 accent-orange-600"
                      />
                      <span className="text-sm">{style.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setSelectedGender('all');
                  setSelectedStyle('all');
                }}
                className="w-full text-sm text-orange-600 hover:text-orange-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </aside>

          {/* Filters - Mobile Modal */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
              <div className="glass-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white/80 backdrop-blur-sm p-4 border-b border-white/40 flex items-center justify-between">
                  <h3 className="font-semibold">Filtres</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 space-y-6">
                  {/* Gender Filter */}
                  <div>
                    <h4 className="text-sm mb-3 text-gray-700 font-medium">Genre</h4>
                    <div className="space-y-2">
                      {(['all', 'homme', 'femme'] as const).map(gender => (
                        <label key={gender} className="flex items-center gap-3 cursor-pointer p-3 glass-button rounded-xl hover:bg-orange-500/10 transition-all">
                          <input
                            type="radio"
                            name="gender-mobile"
                            checked={selectedGender === gender}
                            onChange={() => setSelectedGender(gender)}
                            className="w-4 h-4 text-orange-600 accent-orange-600"
                          />
                          <span className="text-sm capitalize flex-1">
                            {gender === 'all' ? 'Tous' : gender}
                          </span>
                          {selectedGender === gender && (
                            <Check className="w-4 h-4 text-orange-600" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Style Filter */}
                  <div>
                    <h4 className="text-sm mb-3 text-gray-700 font-medium">Style</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer p-3 glass-button rounded-xl hover:bg-orange-500/10 transition-all">
                        <input
                          type="radio"
                          name="style-mobile"
                          checked={selectedStyle === 'all'}
                          onChange={() => setSelectedStyle('all')}
                          className="w-4 h-4 text-orange-600 accent-orange-600"
                        />
                        <span className="text-sm flex-1">Tous</span>
                        {selectedStyle === 'all' && (
                          <Check className="w-4 h-4 text-orange-600" />
                        )}
                      </label>
                      {styles.map(style => (
                        <label key={style.id} className="flex items-center gap-3 cursor-pointer p-3 glass-button rounded-xl hover:bg-orange-500/10 transition-all">
                          <input
                            type="radio"
                            name="style-mobile"
                            checked={selectedStyle === style.slug}
                            onChange={() => setSelectedStyle(style.slug)}
                            className="w-4 h-4 text-orange-600 accent-orange-600"
                          />
                          <span className="text-sm flex-1">{style.name}</span>
                          {selectedStyle === style.slug && (
                            <Check className="w-4 h-4 text-orange-600" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 border-t border-white/40 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedGender('all');
                      setSelectedStyle('all');
                    }}
                    className="flex-1 glass-button px-4 py-2.5 rounded-xl hover:scale-105 transition-transform text-sm"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 bg-orange-600 text-white px-4 py-2.5 rounded-xl hover:bg-orange-700 transition-colors text-sm"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center text-gray-500">
                <p>Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};