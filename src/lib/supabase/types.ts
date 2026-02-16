// ============================================
// 🔷 TYPES SUPABASE - ROUKI E-COMMERCE
// ============================================
// Généré automatiquement à partir du schéma SQL
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================
// DATABASE TYPES
// ============================================

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          email: string
          password_hash: string
          role: 'ADMIN' | 'STAFF'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          role?: 'ADMIN' | 'STAFF'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          role?: 'ADMIN' | 'STAFF'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          full_name: string
          phone_number: string
          city: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          phone_number: string
          city?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone_number?: string
          city?: string | null
          created_at?: string
        }
      }
      styles: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          gender: 'homme' | 'femme'
          style_slug: string
          purchase_price: number
          selling_price: number
          material: string | null
          color: string | null
          sku: string | null
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          gender: 'homme' | 'femme'
          style_slug: string
          purchase_price: number
          selling_price: number
          material?: string | null
          color?: string | null
          sku?: string | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          gender?: 'homme' | 'femme'
          style_slug?: string
          purchase_price?: number
          selling_price?: number
          material?: string | null
          color?: string | null
          sku?: string | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_sizes: {
        Row: {
          id: string
          product_id: string
          size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
          stock_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
          stock_quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
          stock_quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          is_main: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          is_main?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          is_main?: boolean
          display_order?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          total_amount: number
          status: 'PENDING_CONTACT' | 'CONFIRMED' | 'IN_DELIVERY' | 'DELIVERED' | 'CANCELLED'
          customer_note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          total_amount: number
          status?: 'PENDING_CONTACT' | 'CONFIRMED' | 'IN_DELIVERY' | 'DELIVERED' | 'CANCELLED'
          customer_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          total_amount?: number
          status?: 'PENDING_CONTACT' | 'CONFIRMED' | 'IN_DELIVERY' | 'DELIVERED' | 'CANCELLED'
          customer_note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          size: string
          quantity: number
          unit_price: number
          purchase_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          size: string
          quantity: number
          unit_price: number
          purchase_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          size?: string
          quantity?: number
          unit_price?: number
          purchase_price?: number
          created_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          product_id: string
          size: string
          quantity_change: number
          reason: 'SALE' | 'RESTOCK' | 'ADJUSTMENT' | 'RETURN'
          reference_id: string | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size: string
          quantity_change: number
          reason: 'SALE' | 'RESTOCK' | 'ADJUSTMENT' | 'RETURN'
          reference_id?: string | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          size?: string
          quantity_change?: number
          reason?: 'SALE' | 'RESTOCK' | 'ADJUSTMENT' | 'RETURN'
          reference_id?: string | null
          note?: string | null
          created_at?: string
        }
      }
      email_logs: {
        Row: {
          id: string
          order_id: string | null
          recipient_email: string
          subject: string
          body: string | null
          status: 'PENDING' | 'SENT' | 'FAILED'
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          recipient_email: string
          subject: string
          body?: string | null
          status?: 'PENDING' | 'SENT' | 'FAILED'
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          recipient_email?: string
          subject?: string
          body?: string | null
          status?: 'PENDING' | 'SENT' | 'FAILED'
          sent_at?: string | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      products_with_stock: {
        Row: {
          id: string
          name: string
          description: string
          gender: 'homme' | 'femme'
          style_slug: string
          purchase_price: number
          selling_price: number
          material: string | null
          color: string | null
          sku: string | null
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
          total_stock: number
        }
      }
      orders_with_profit: {
        Row: {
          id: string
          customer_id: string
          total_amount: number
          status: string
          customer_note: string | null
          created_at: string
          updated_at: string
          customer_name: string
          customer_phone: string
          customer_city: string | null
          profit: number
        }
      }
      sales_stats: {
        Row: {
          total_orders: number
          delivered_orders: number
          total_revenue: number
          total_profit: number
        }
      }
    }
    Functions: {
      calculate_order_profit: {
        Args: {
          order_uuid: string
        }
        Returns: number
      }
      get_product_total_stock: {
        Args: {
          product_uuid: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ============================================
// HELPER TYPES
// ============================================

// Raccourcis pour les types de tables
export type Admin = Database['public']['Tables']['admins']['Row']
export type Customer = Database['public']['Tables']['customers']['Row']
export type Style = Database['public']['Tables']['styles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductSize = Database['public']['Tables']['product_sizes']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type StockMovement = Database['public']['Tables']['stock_movements']['Row']
export type EmailLog = Database['public']['Tables']['email_logs']['Row']
export type Setting = Database['public']['Tables']['settings']['Row']

// Raccourcis pour les types d'insertion
export type AdminInsert = Database['public']['Tables']['admins']['Insert']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type StyleInsert = Database['public']['Tables']['styles']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductSizeInsert = Database['public']['Tables']['product_sizes']['Insert']
export type ProductImageInsert = Database['public']['Tables']['product_images']['Insert']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type StockMovementInsert = Database['public']['Tables']['stock_movements']['Insert']
export type EmailLogInsert = Database['public']['Tables']['email_logs']['Insert']
export type SettingInsert = Database['public']['Tables']['settings']['Insert']

// Raccourcis pour les types de mise à jour
export type AdminUpdate = Database['public']['Tables']['admins']['Update']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']
export type StyleUpdate = Database['public']['Tables']['styles']['Update']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type ProductSizeUpdate = Database['public']['Tables']['product_sizes']['Update']
export type ProductImageUpdate = Database['public']['Tables']['product_images']['Update']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update']
export type StockMovementUpdate = Database['public']['Tables']['stock_movements']['Update']
export type EmailLogUpdate = Database['public']['Tables']['email_logs']['Update']
export type SettingUpdate = Database['public']['Tables']['settings']['Update']

// Types pour les vues
export type ProductWithStock = Database['public']['Views']['products_with_stock']['Row']
export type OrderWithProfit = Database['public']['Views']['orders_with_profit']['Row']
export type SalesStats = Database['public']['Views']['sales_stats']['Row']

// ============================================
// TYPES MÉTIER (pour l'interface)
// ============================================

// Produit complet avec ses relations
export interface ProductFull extends Product {
  sizes: ProductSize[]
  images: ProductImage[]
  style?: Style
  total_stock?: number
}

// Commande complète avec ses relations
export interface OrderFull extends Order {
  customer: Customer
  items: OrderItemFull[]
  profit?: number
}

// Item de commande avec le produit
export interface OrderItemFull extends OrderItem {
  product: Product
}

// Status mapping entre l'interface et la DB
export const ORDER_STATUS_MAP = {
  pending: 'PENDING_CONTACT',
  confirmed: 'CONFIRMED',
  delivering: 'IN_DELIVERY',
  delivered: 'DELIVERED',
  cancelled: 'CANCELLED'
} as const

export const ORDER_STATUS_REVERSE_MAP = {
  PENDING_CONTACT: 'pending',
  CONFIRMED: 'confirmed',
  IN_DELIVERY: 'delivering',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const

// Types d'export
export type OrderStatusDB = keyof typeof ORDER_STATUS_REVERSE_MAP
export type OrderStatusUI = keyof typeof ORDER_STATUS_MAP
