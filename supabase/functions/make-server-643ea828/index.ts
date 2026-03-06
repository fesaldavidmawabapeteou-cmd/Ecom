import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Middleware to handle authentication - DISABLED FOR NOW
// app.use('*', async (c, next) => {
//   // Temporarily allow all requests for testing
//   await next();
// });

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ==================== TYPES ====================
type Gender = 'homme' | 'femme';
type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled';

interface StyleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Product {
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

interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  city?: string;
  note?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

// ==================== INITIALIZATION ====================
// Initialize default data if KV store is empty
async function initializeDefaultData() {
  try {
    // Check if already initialized
    const initialized = await kv.get('system:initialized');
    if (initialized) {
      console.log('✅ Database already initialized');
      return;
    }

    console.log('🔄 Initializing default data...');

    // Default styles
    const defaultStyles: StyleCategory[] = [
      { id: '1', name: 'Streetwear', slug: 'streetwear', description: 'Style urbain et décontracté' },
      { id: '2', name: 'Casual', slug: 'casual', description: 'Tenue décontractée pour tous les jours' },
      { id: '3', name: 'Corporate', slug: 'corporate', description: 'Style professionnel et élégant' }
    ];

    for (const style of defaultStyles) {
      await kv.set(`styles:${style.id}`, style);
    }

    // Default products
    const defaultProducts: Product[] = [
      {
        id: '1',
        name: 'T-Shirt Streetwear Premium',
        description: 'T-shirt de qualité supérieure, coupe moderne et confortable',
        gender: 'homme',
        style: 'streetwear',
        price: 15000,
        costPrice: 8000,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 12 },
          { size: 'XL', stock: 8 }
        ]
      },
      {
        id: '2',
        name: 'Chemise Corporate Blanche',
        description: 'Chemise professionnelle, parfaite pour le bureau',
        gender: 'homme',
        style: 'corporate',
        price: 25000,
        costPrice: 12000,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
        sizes: [
          { size: 'M', stock: 8 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 5 }
        ]
      },
      {
        id: '3',
        name: 'Robe Casual Élégante',
        description: 'Robe légère et élégante pour toutes occasions',
        gender: 'femme',
        style: 'casual',
        price: 20000,
        costPrice: 10000,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
        sizes: [
          { size: 'S', stock: 12 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 10 }
        ]
      },
      {
        id: '4',
        name: 'Jean Streetwear Délavé',
        description: 'Jean tendance avec finitions premium',
        gender: 'homme',
        style: 'streetwear',
        price: 30000,
        costPrice: 15000,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        sizes: [
          { size: 'M', stock: 10 },
          { size: 'L', stock: 12 },
          { size: 'XL', stock: 8 }
        ]
      },
      {
        id: '5',
        name: 'Ensemble Corporate Femme',
        description: 'Tailleur professionnel moderne',
        gender: 'femme',
        style: 'corporate',
        price: 45000,
        costPrice: 22000,
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500',
        sizes: [
          { size: 'S', stock: 5 },
          { size: 'M', stock: 8 },
          { size: 'L', stock: 6 }
        ]
      },
      {
        id: '6',
        name: 'Sweat Streetwear Oversize',
        description: 'Sweat confortable avec design moderne',
        gender: 'femme',
        style: 'streetwear',
        price: 22000,
        costPrice: 11000,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        sizes: [
          { size: 'S', stock: 15 },
          { size: 'M', stock: 20 },
          { size: 'L', stock: 10 }
        ]
      }
    ];

    for (const product of defaultProducts) {
      await kv.set(`products:${product.id}`, product);
    }

    // Default admin credentials
    await kv.set('admin:credentials', {
      email: 'admin@roukii.com',
      password: 'Roukii@2026' // Dans un vrai système, ce serait hashé
    });

    // Mark as initialized
    await kv.set('system:initialized', true);

    console.log('✅ Default data initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing default data:', error);
  }
}

// Run initialization on server start
initializeDefaultData();

// ==================== HEALTH CHECK ====================
app.get("/make-server-643ea828/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ==================== ADMIN AUTH ====================
app.post("/make-server-643ea828/admin/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const credentials = await kv.get('admin:credentials');
    
    if (credentials && credentials.email === email && credentials.password === password) {
      return c.json({ 
        success: true, 
        message: 'Login successful',
        admin: { email }
      });
    }

    return c.json({ success: false, message: 'Invalid credentials' }, 401);
  } catch (error) {
    console.error('Admin login error:', error);
    return c.json({ success: false, message: `Login error: ${error}` }, 500);
  }
});

// Change admin password
app.post("/make-server-643ea828/admin/change-password", async (c) => {
  try {
    const { currentPassword, newPassword } = await c.req.json();

    const credentials = await kv.get('admin:credentials');
    
    if (!credentials || credentials.password !== currentPassword) {
      return c.json({ success: false, message: 'Mot de passe actuel incorrect' }, 401);
    }

    const updatedCredentials = {
      ...credentials,
      password: newPassword
    };

    await kv.set('admin:credentials', updatedCredentials);

    return c.json({ 
      success: true, 
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return c.json({ success: false, message: `Erreur: ${error}` }, 500);
  }
});

// Reset store - delete all data
app.post("/make-server-643ea828/admin/reset-store", async (c) => {
  try {
    // Delete all products
    const products = await kv.getByPrefix('products:');
    for (const [key] of Object.entries(products || {})) {
      await kv.del(key);
    }

    // Delete all orders
    const orders = await kv.getByPrefix('orders:');
    for (const [key] of Object.entries(orders || {})) {
      await kv.del(key);
    }

    // Delete all styles
    const styles = await kv.getByPrefix('styles:');
    for (const [key] of Object.entries(styles || {})) {
      await kv.del(key);
    }

    return c.json({ 
      success: true, 
      message: 'Boutique réinitialisée avec succès'
    });
  } catch (error) {
    console.error('Reset store error:', error);
    return c.json({ success: false, message: `Erreur: ${error}` }, 500);
  }
});

// ==================== PRODUCTS ====================
// Get all products
app.get("/make-server-643ea828/products", async (c) => {
  try {
    const products = await kv.getByPrefix('products:');
    return c.json({ success: true, products: Object.values(products) });
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ success: false, message: `Error fetching products: ${error}` }, 500);
  }
});

// Get single product
app.get("/make-server-643ea828/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`products:${id}`);
    
    if (!product) {
      return c.json({ success: false, message: 'Product not found' }, 404);
    }

    return c.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json({ success: false, message: `Error fetching product: ${error}` }, 500);
  }
});

// Create product
app.post("/make-server-643ea828/products", async (c) => {
  try {
    const productData = await c.req.json();
    const id = `PROD-${Date.now()}`;
    
    const newProduct: Product = {
      ...productData,
      id
    };

    await kv.set(`products:${id}`, newProduct);

    return c.json({ success: true, product: newProduct }, 201);
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json({ success: false, message: `Error creating product: ${error}` }, 500);
  }
});

// Update product
app.put("/make-server-643ea828/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const existingProduct = await kv.get(`products:${id}`);
    
    if (!existingProduct) {
      return c.json({ success: false, message: 'Product not found' }, 404);
    }

    const updates = await c.req.json();
    const updatedProduct = { ...existingProduct, ...updates };

    await kv.set(`products:${id}`, updatedProduct);

    return c.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return c.json({ success: false, message: `Error updating product: ${error}` }, 500);
  }
});

// Delete product
app.delete("/make-server-643ea828/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`products:${id}`);

    return c.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ success: false, message: `Error deleting product: ${error}` }, 500);
  }
});

// ==================== EMAIL SENDER ====================
async function sendOrderEmailToAdmin(order: Order) {
  try {
    console.log('📧 sendOrderEmailToAdmin called for order:', order.id);
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('🔑 RESEND_API_KEY found:', !!resendApiKey);
    console.log('📋 Available env keys:', Object.keys(Deno.env.toObject()).filter(k => k.includes('RESEND') || k.includes('EMAIL')));
    
    if (!resendApiKey) {
      console.warn('⚠️ RESEND_API_KEY not configured — email not sent');
      return;
    }

    const adminCreds = await kv.get('admin:credentials');
    const adminEmail = adminCreds?.email || 'admin@roukii.com';
    const fromDomain = Deno.env.get('EMAIL_FROM_DOMAIN') || 'noreply@order.roukii.com';

    const itemsHtml = order.items
      .map(i => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${i.product.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${i.size}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">×${i.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(i.product.price * i.quantity).toLocaleString('fr-FR')} FCFA</td>
        </tr>
      `)
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #222; }
            .order-info { background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
            .order-info p { margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            table th { background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
            .total { font-size: 18px; font-weight: bold; text-align: right; padding: 15px; background-color: #f9f9f9; border-radius: 4px; }
            .note { background-color: #fff9e6; padding: 15px; border-left: 4px solid #ffc107; margin-top: 15px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Nouvelle Commande Reçue</h1>
              <p style="margin: 10px 0 0 0; color: #666;">Commande ID: <strong>${order.id}</strong></p>
            </div>

            <div class="order-info">
              <h3 style="margin-top: 0;">Information Client</h3>
              <p><strong>Nom:</strong> ${order.customerName}</p>
              <p><strong>Téléphone:</strong> ${order.phone}</p>
              ${order.city ? `<p><strong>Ville:</strong> ${order.city}</p>` : ''}
            </div>

            <h3>Détails de la Commande</h3>
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Taille</th>
                  <th>Quantité</th>
                  <th style="text-align: right;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total">
              Total: ${order.total.toLocaleString('fr-FR')} FCFA
            </div>

            ${order.note ? `<div class="note"><strong>Note du client:</strong><br>${order.note}</div>` : ''}

            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
              Cet email a été envoyé automatiquement. Veuillez ne pas répondre.
            </p>
          </div>
        </body>
      </html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: fromDomain,
        to: adminEmail,
        subject: `Nouvelle commande ${order.id} - ROUKI`,
        html: htmlContent
      })
    });

    if (response.ok) {
      const data = await response.json() as { id: string };
      console.log(`✅ Email envoyé avec succès à ${adminEmail} (Resend ID: ${data.id})`);
      
      // Log en KV pour traçabilité
      await kv.set(`email_logs:${order.id}`, {
        orderId: order.id,
        recipientEmail: adminEmail,
        resendId: data.id,
        status: 'SENT',
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    } else {
      const errorText = await response.text();
      console.error(`❌ Erreur Resend (${response.status}):`, errorText);
      
      await kv.set(`email_logs:${order.id}`, {
        orderId: order.id,
        recipientEmail: adminEmail,
        status: 'FAILED',
        error: errorText,
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
  }
}

// ==================== ORDERS ====================
// Get all orders
app.get("/make-server-643ea828/orders", async (c) => {
  try {
    const orders = await kv.getByPrefix('orders:');
    // Sort by createdAt descending
    const sortedOrders = Object.values(orders).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ success: true, orders: sortedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json({ success: false, message: `Error fetching orders: ${error}` }, 500);
  }
});

// Get single order
app.get("/make-server-643ea828/orders/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const order = await kv.get(`orders:${id}`);
    
    if (!order) {
      return c.json({ success: false, message: 'Order not found' }, 404);
    }

    return c.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return c.json({ success: false, message: `Error fetching order: ${error}` }, 500);
  }
});

// Create order
app.post("/make-server-643ea828/orders", async (c) => {
  try {
    const orderData = await c.req.json();
    const id = `ORD-${Date.now()}`;
    
    const newOrder: Order = {
      ...orderData,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(`orders:${id}`, newOrder);

    // Update product stock
    for (const item of newOrder.items) {
      const product = await kv.get(`products:${item.product.id}`);
      if (product) {
        const updatedSizes = product.sizes.map((s: { size: string; stock: number }) =>
          s.size === item.size
            ? { ...s, stock: Math.max(0, s.stock - item.quantity) }
            : s
        );
        await kv.set(`products:${item.product.id}`, { ...product, sizes: updatedSizes });
      }
    }

    // Send email to admin
    await sendOrderEmailToAdmin(newOrder);

    return c.json({ success: true, order: newOrder }, 201);
  } catch (error) {
    console.error('Error creating order:', error);
    return c.json({ success: false, message: `Error creating order: ${error}` }, 500);
  }
});

// Update order status
app.put("/make-server-643ea828/orders/:id/status", async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    const existingOrder = await kv.get(`orders:${id}`);
    
    if (!existingOrder) {
      return c.json({ success: false, message: 'Order not found' }, 404);
    }

    const updatedOrder = { ...existingOrder, status };
    await kv.set(`orders:${id}`, updatedOrder);

    return c.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    return c.json({ success: false, message: `Error updating order status: ${error}` }, 500);
  }
});

// ==================== STYLES ====================
// Get all styles
app.get("/make-server-643ea828/styles", async (c) => {
  try {
    const styles = await kv.getByPrefix('styles:');
    return c.json({ success: true, styles: Object.values(styles) });
  } catch (error) {
    console.error('Error fetching styles:', error);
    return c.json({ success: false, message: `Error fetching styles: ${error}` }, 500);
  }
});

// Create style
app.post("/make-server-643ea828/styles", async (c) => {
  try {
    const styleData = await c.req.json();
    const id = `STYLE-${Date.now()}`;
    
    const newStyle: StyleCategory = {
      ...styleData,
      id
    };

    await kv.set(`styles:${id}`, newStyle);

    return c.json({ success: true, style: newStyle }, 201);
  } catch (error) {
    console.error('Error creating style:', error);
    return c.json({ success: false, message: `Error creating style: ${error}` }, 500);
  }
});

// Update style
app.put("/make-server-643ea828/styles/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const existingStyle = await kv.get(`styles:${id}`);
    
    if (!existingStyle) {
      return c.json({ success: false, message: 'Style not found' }, 404);
    }

    const updates = await c.req.json();
    const updatedStyle = { ...existingStyle, ...updates };

    await kv.set(`styles:${id}`, updatedStyle);

    return c.json({ success: true, style: updatedStyle });
  } catch (error) {
    console.error('Error updating style:', error);
    return c.json({ success: false, message: `Error updating style: ${error}` }, 500);
  }
});

// Delete style
app.delete("/make-server-643ea828/styles/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`styles:${id}`);

    return c.json({ success: true, message: 'Style deleted' });
  } catch (error) {
    console.error('Error deleting style:', error);
    return c.json({ success: false, message: `Error deleting style: ${error}` }, 500);
  }
});

// ==================== STATS ====================
app.get("/make-server-643ea828/stats", async (c) => {
  try {
    const [ordersObj, productsObj] = await Promise.all([
      kv.getByPrefix('orders:'),
      kv.getByPrefix('products:')
    ]);

    const orders = Object.values(ordersObj);
    const products = Object.values(productsObj);

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isActive !== false).length;
    
    // Calculate total stock
    const totalStock = products.reduce((sum, product) => {
      return sum + product.sizes.reduce((s: number, size: { stock: number }) => s + size.stock, 0);
    }, 0);

    // Calculate profit from delivered orders
    const profit = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => {
        const orderProfit = order.items.reduce((itemSum: number, item: any) => {
          const margin = item.product.price - (item.product.costPrice || 0);
          return itemSum + (margin * item.quantity);
        }, 0);
        return sum + orderProfit;
      }, 0);

    // Orders by status
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      delivering: orders.filter(o => o.status === 'delivering').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    // Recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = orders.filter(o => 
      new Date(o.createdAt) > sevenDaysAgo
    );

    // Revenue by day (last 7 days)
    const revenueByDay = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      return {
        date: date.toISOString().split('T')[0],
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length
      };
    });

    return c.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalProducts,
        activeProducts,
        totalStock,
        profit,
        ordersByStatus,
        recentOrdersCount: recentOrders.length,
        revenueByDay
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ success: false, message: `Error fetching stats: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);