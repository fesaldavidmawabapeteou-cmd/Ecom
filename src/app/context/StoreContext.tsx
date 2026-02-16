import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../hooks/useApi';
import { toast } from 'sonner';

export type Gender = 'homme' | 'femme';
export type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled';

export interface StyleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  gender: Gender;
  style: string;
  price: number;
  costPrice: number;
  image: string;
  images?: string[];
  mainImageIndex?: number;
  sizes: { size: string; stock: number }[];
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city?: string;
  note?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date | string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  styles: StyleCategory[];
  isAdmin: boolean;
  loading: boolean;
  addToCart: (product: Product, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (customerInfo: { name: string; phone: string; city?: string; note?: string }) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addStyle: (style: Omit<StyleCategory, 'id'>) => Promise<void>;
  updateStyle: (id: string, style: Partial<StyleCategory>) => Promise<void>;
  deleteStyle: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [styles, setStyles] = useState<StyleCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data from backend on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsData, stylesData] = await Promise.all([
        api.getProducts(),
        api.getStyles(),
      ]);
      
      setProducts(productsData);
      setStyles(stylesData);
      
      // Load cart from localStorage
      const savedCart = localStorage.getItem('rouki-cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      // Load admin state from localStorage
      const savedAdmin = localStorage.getItem('rouki-admin');
      if (savedAdmin === 'true') {
        setIsAdmin(true);
        const ordersData = await api.getOrders();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rouki-cart', JSON.stringify(cart));
  }, [cart]);

  // ==================== CART ====================
  const addToCart = (product: Product, size: string, quantity: number) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id && item.size === size);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, size, quantity }];
    });
    toast.success('Produit ajouté au panier');
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
    toast.success('Produit retiré du panier');
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('rouki-cart');
  };

  // ==================== ORDERS ====================
  const createOrder = async (customerInfo: { name: string; phone: string; city?: string; note?: string }): Promise<string> => {
    try {
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      
      const orderData = {
        customerName: customerInfo.name,
        phone: customerInfo.phone,
        city: customerInfo.city,
        note: customerInfo.note,
        items: cart,
        total,
      };

      const response = await api.createOrder(orderData);
      
      if (response.success) {
        clearCart();
        toast.success('Commande créée avec succès');
        return response.order.id;
      } else {
        toast.error(response.message || 'Erreur lors de la création de la commande');
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erreur lors de la création de la commande');
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await api.updateOrderStatus(orderId, status);
      
      if (response.success) {
        setOrders(prev =>
          prev.map(order => order.id === orderId ? { ...order, status } : order)
        );
        toast.success('Statut de commande mis à jour');
      } else {
        toast.error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  // ==================== AUTH ====================
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.adminLogin(email, password);
      
      if (response.success) {
        setIsAdmin(true);
        localStorage.setItem('rouki-admin', 'true');
        
        // Load orders after successful login
        const ordersData = await api.getOrders();
        setOrders(ordersData);
        
        toast.success('Connexion réussie');
        return true;
      } else {
        toast.error('Identifiants incorrects');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur de connexion');
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setOrders([]);
    localStorage.removeItem('rouki-admin');
    toast.success('Déconnexion réussie');
  };

  // ==================== PRODUCTS ====================
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const response = await api.createProduct(product);
      
      if (response.success) {
        setProducts(prev => [...prev, response.product]);
        toast.success('Produit ajouté avec succès');
      } else {
        toast.error(response.message || 'Erreur lors de l\'ajout du produit');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    }
  };

  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
    try {
      const response = await api.updateProduct(id, updatedData);
      
      if (response.success) {
        setProducts(prev =>
          prev.map(product => product.id === id ? { ...product, ...updatedData } : product)
        );
        toast.success('Produit mis à jour avec succès');
      } else {
        toast.error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la mise à jour du produit');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await api.deleteProduct(id);
      
      if (response.success) {
        setProducts(prev => prev.filter(product => product.id !== id));
        toast.success('Produit supprimé avec succès');
      } else {
        toast.error(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  // ==================== STYLES ====================
  const addStyle = async (style: Omit<StyleCategory, 'id'>) => {
    try {
      const response = await api.createStyle(style);
      
      if (response.success) {
        setStyles(prev => [...prev, response.style]);
        toast.success('Style ajouté avec succès');
      } else {
        toast.error(response.message || 'Erreur lors de l\'ajout du style');
      }
    } catch (error) {
      console.error('Error adding style:', error);
      toast.error('Erreur lors de l\'ajout du style');
    }
  };

  const updateStyle = async (id: string, updatedData: Partial<StyleCategory>) => {
    try {
      const response = await api.updateStyle(id, updatedData);
      
      if (response.success) {
        setStyles(prev =>
          prev.map(style => style.id === id ? { ...style, ...updatedData } : style)
        );
        toast.success('Style mis à jour avec succès');
      } else {
        toast.error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating style:', error);
      toast.error('Erreur lors de la mise à jour du style');
    }
  };

  const deleteStyle = async (id: string) => {
    try {
      const response = await api.deleteStyle(id);
      
      if (response.success) {
        setStyles(prev => prev.filter(style => style.id !== id));
        toast.success('Style supprimé avec succès');
      } else {
        toast.error(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting style:', error);
      toast.error('Erreur lors de la suppression du style');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        styles,
        isAdmin,
        loading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        updateOrderStatus,
        login,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        addStyle,
        updateStyle,
        deleteStyle,
        refreshData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
