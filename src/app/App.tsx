import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AdminLayout } from './components/AdminLayout';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Catalog = React.lazy(() => import('./pages/Catalog').then(module => ({ default: module.Catalog })));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail').then(module => ({ default: module.ProductDetail })));
const Cart = React.lazy(() => import('./pages/Cart').then(module => ({ default: module.Cart })));
const Checkout = React.lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));

// Admin Pages
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin').then(module => ({ default: module.AdminLogin })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts').then(module => ({ default: module.AdminProducts })));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders').then(module => ({ default: module.AdminOrders })));
const AdminStyles = React.lazy(() => import('./pages/admin/AdminStyles').then(module => ({ default: module.AdminStyles })));
const AdminStats = React.lazy(() => import('./pages/admin/AdminStats').then(module => ({ default: module.AdminStats })));
const AdminParameters = React.lazy(() => import('./pages/admin/AdminParameters').then(module => ({ default: module.AdminParameters })));

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Chargement de ROUKI...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { loading } = useStore();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}
      
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="styles" element={<AdminStyles />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="parameters" element={<AdminParameters />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {!isAdminRoute && <Footer />}
      <Toaster position="top-center" richColors />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;