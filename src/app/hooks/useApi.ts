import { useState, useCallback } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-643ea828`;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T,>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.message || `HTTP error! status: ${response.status}`;
        setError(errorMessage);
        console.error(`API Error on ${endpoint}:`, errorMessage);
        return { success: false, error: errorMessage };
      }

      setLoading(false);
      return { success: true, data: data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error(`API Request Error on ${endpoint}:`, err);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  return { request, loading, error };
}

// Specific API functions
export const ap{
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    const data = await response.json();
    return data.success ? data.products : [];
  },

  getProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    const data = await response.json();
    return data.success ? data.product : null;
  },

  createProduct: async (product: any) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(product),
    });
    const data = await response.json();
    return data;
  },

  updateProduct: async (id: string, updates: any) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    return data;
  },

  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    const data = await response.json();
    return data;
  },

  // Orders
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    const data = await response.json();
    return data.success ? data.orders : [];
  },

  getOrder: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    const data = await response.json();
    return data.success ? data.order : null;
  },

  createOrder: async (order: any) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(order),
    });
    const data = await response.json();
    return data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    return data;
  },

  // Styles
  getStyles: async () => {
    const response = await fetch(`${API_BASE_URL}/styles`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    const data = await response.json();
    return data.success ? data.styles : [];
  },

  createStyle: async (style: any) => {
    const response = await fetch(`${API_BASE_URL}/styles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(style),
    });
    const data = await response.json();
    return data;
  },

  updateStyle: async (id: string, updates: any) => {
    const response = await fetch(`${API_BASE_URL}/styles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    return data;
  },

  deleteStyle: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/styles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    const data = await response.json();
    return data;
  },

  // Admin Auth
  adminLogin: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  },

  // Stats
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    const data = await response.json();
    return data.success ? data.stats : null;
  },

  // Admin Parameters
  changeAdminPassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await fetch(`${API_BASE_URL}/admin/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(passwordData),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Erreur lors du changement de mot de passe');
    }
    return data;
  },

  resetStore: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/reset-store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      }
  resetStore: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/reset-store`, {
      method: 'POST',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Erreur lors de la réinitialisation');
    }
    return data;
  },
};
