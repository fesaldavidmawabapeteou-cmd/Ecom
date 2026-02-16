import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shirt } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const { products, styles } = useStore();

  // Get latest products (first 3)
  const newProducts = products.slice(0, 3);

  // Group products by style - using dynamic styles
  const productsByStyle = styles.map(style => ({
    style,
    products: products.filter(p => p.style === style.slug).slice(0, 2)
  })).filter(group => group.products.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 leading-tight">
              Style Moderne, <br />Livraison Assurée
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-orange-100 mb-6 sm:mb-8">
              Commandez maintenant, payez à la livraison.
            </p>
            <Link 
              to="/catalog" 
              className="inline-flex items-center gap-2 glass-button text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-3xl font-semibold text-sm sm:text-base hover:scale-105 transition-transform"
            >
              Voir la collection
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center glass-card p-6 rounded-2xl">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <Shirt className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="mb-1">Qualité Premium</h3>
              <p className="text-sm text-gray-600">Vêtements de haute qualité</p>
            </div>
            <div className="flex flex-col items-center glass-card p-6 rounded-2xl">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="mb-1">Tendances 2024</h3>
              <p className="text-sm text-gray-600">Styles modernes et actuels</p>
            </div>
            <div className="flex flex-col items-center glass-card p-6 rounded-2xl">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="mb-1">Paiement à la livraison</h3>
              <p className="text-sm text-gray-600">Payez quand vous recevez</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nouveautés */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl">Nouveautés</h2>
            <Link to="/catalog" className="text-orange-600 hover:text-orange-700 flex items-center gap-2">
              Tout voir
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Par Style */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-8">Par Style</h2>

          {productsByStyle.map(group => (
            <div key={group.style.id} className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl">{group.style.name}</h3>
                <Link to={`/catalog?style=${group.style.slug}`} className="text-orange-600 hover:text-orange-700 flex items-center gap-2">
                  Voir tout
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {group.products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Prêt à commander ?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Parcourez notre collection et commandez dès maintenant
          </p>
          <Link 
            to="/catalog" 
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-3xl hover:bg-orange-50 transition-colors"
          >
            Découvrir la collection
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};