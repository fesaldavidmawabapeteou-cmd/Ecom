-- ============================================
-- 🗄️ MIGRATION INITIALE - ROUKI E-COMMERCE
-- ============================================
-- Description: Création de la structure complète de la base de données
-- Date: 2024-12-22
-- ============================================

-- ============================================
-- 1️⃣ TABLES D'AUTHENTIFICATION (ADMIN)
-- ============================================

-- Table: admins
-- Description: Comptes administrateurs pour accéder au dashboard
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN' CHECK (role IN ('ADMIN', 'STAFF')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide par email
CREATE INDEX idx_admins_email ON admins(email);

-- ============================================
-- 2️⃣ CLIENTS (SANS COMPTE)
-- ============================================

-- Table: customers
-- Description: Clients qui passent commande (pas de login requis)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide par téléphone
CREATE INDEX idx_customers_phone ON customers(phone_number);

-- ============================================
-- 3️⃣ STYLES DYNAMIQUES
-- ============================================

-- Table: styles
-- Description: Catégories de style dynamiques (Streetwear, Casual, Corporate, etc.)
CREATE TABLE styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide par slug
CREATE INDEX idx_styles_slug ON styles(slug);

-- ============================================
-- 4️⃣ PRODUITS & CATALOGUE
-- ============================================

-- Table: products
-- Description: Produits du catalogue
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('homme', 'femme')),
  style_slug TEXT NOT NULL REFERENCES styles(slug) ON DELETE RESTRICT,
  purchase_price NUMERIC(10, 2) NOT NULL CHECK (purchase_price >= 0),
  selling_price NUMERIC(10, 2) NOT NULL CHECK (selling_price >= 0),
  material TEXT,
  color TEXT,
  sku TEXT UNIQUE,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour filtres
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_style ON products(style_slug);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);

-- ============================================
-- Table: product_sizes
-- Description: Stock par taille pour chaque produit
CREATE TABLE product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL CHECK (size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL')),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, size)
);

-- Index pour recherche rapide
CREATE INDEX idx_product_sizes_product ON product_sizes(product_id);

-- ============================================
-- Table: product_images
-- Description: Images des produits
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_main ON product_images(product_id, is_main) WHERE is_main = true;

-- ============================================
-- 5️⃣ COMMANDES (CŒUR DU SYSTÈME)
-- ============================================

-- Table: orders
-- Description: Commandes passées par les clients
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'PENDING_CONTACT' CHECK (
    status IN ('PENDING_CONTACT', 'CONFIRMED', 'IN_DELIVERY', 'DELIVERED', 'CANCELLED')
  ),
  customer_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- Table: order_items
-- Description: Détails des produits commandés
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  purchase_price NUMERIC(10, 2) NOT NULL CHECK (purchase_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================
-- 6️⃣ SUIVI DES STOCKS (AUDIT)
-- ============================================

-- Table: stock_movements
-- Description: Historique des mouvements de stock
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  size TEXT NOT NULL,
  quantity_change INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('SALE', 'RESTOCK', 'ADJUSTMENT', 'RETURN')),
  reference_id UUID,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at DESC);

-- ============================================
-- 7️⃣ EMAILS & NOTIFICATIONS
-- ============================================

-- Table: email_logs
-- Description: Suivi des emails envoyés
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_email_logs_order ON email_logs(order_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- ============================================
-- 8️⃣ PARAMÈTRES GÉNÉRAUX
-- ============================================

-- Table: settings
-- Description: Configuration générale de la boutique
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 9️⃣ FONCTIONS UTILITAIRES
-- ============================================

-- Fonction: update_updated_at_column
-- Description: Met à jour automatiquement le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_styles_updated_at BEFORE UPDATE ON styles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_sizes_updated_at BEFORE UPDATE ON product_sizes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Fonction: calculate_order_profit
-- Description: Calcule le bénéfice d'une commande
CREATE OR REPLACE FUNCTION calculate_order_profit(order_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_profit NUMERIC := 0;
BEGIN
  SELECT COALESCE(SUM((unit_price - purchase_price) * quantity), 0)
  INTO total_profit
  FROM order_items
  WHERE order_id = order_uuid;
  
  RETURN total_profit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Fonction: get_product_total_stock
-- Description: Retourne le stock total d'un produit
CREATE OR REPLACE FUNCTION get_product_total_stock(product_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_stock INTEGER := 0;
BEGIN
  SELECT COALESCE(SUM(stock_quantity), 0)
  INTO total_stock
  FROM product_sizes
  WHERE product_id = product_uuid;
  
  RETURN total_stock;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Fonction: update_stock_on_order_delivery
-- Description: Déduit le stock lorsqu'une commande est livrée
CREATE OR REPLACE FUNCTION update_stock_on_order_delivery()
RETURNS TRIGGER AS $$
BEGIN
  -- Si le statut passe à IN_DELIVERY, déduire le stock
  IF NEW.status = 'IN_DELIVERY' AND OLD.status != 'IN_DELIVERY' THEN
    -- Pour chaque item de la commande
    UPDATE product_sizes ps
    SET stock_quantity = stock_quantity - oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
      AND ps.product_id = oi.product_id
      AND ps.size = oi.size;
    
    -- Enregistrer les mouvements de stock
    INSERT INTO stock_movements (product_id, size, quantity_change, reason, reference_id, note)
    SELECT 
      oi.product_id,
      oi.size,
      -oi.quantity,
      'SALE',
      NEW.id,
      'Stock déduit pour commande ' || NEW.id
    FROM order_items oi
    WHERE oi.order_id = NEW.id;
  END IF;
  
  -- Si la commande est annulée après avoir été en livraison, restaurer le stock
  IF NEW.status = 'CANCELLED' AND OLD.status = 'IN_DELIVERY' THEN
    UPDATE product_sizes ps
    SET stock_quantity = stock_quantity + oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
      AND ps.product_id = oi.product_id
      AND ps.size = oi.size;
    
    -- Enregistrer les mouvements de stock
    INSERT INTO stock_movements (product_id, size, quantity_change, reason, reference_id, note)
    SELECT 
      oi.product_id,
      oi.size,
      oi.quantity,
      'RETURN',
      NEW.id,
      'Stock restauré pour annulation commande ' || NEW.id
    FROM order_items oi
    WHERE oi.order_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour gérer le stock automatiquement
CREATE TRIGGER trigger_update_stock_on_order_delivery
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_order_delivery();

-- ============================================
-- 🔟 DONNÉES INITIALES
-- ============================================

-- Insertion des styles par défaut
INSERT INTO styles (name, slug, description) VALUES
  ('Streetwear', 'streetwear', 'Style urbain et décontracté'),
  ('Casual', 'casual', 'Tenue décontractée pour tous les jours'),
  ('Corporate', 'corporate', 'Style professionnel et élégant');

-- Insertion des paramètres par défaut
INSERT INTO settings (key, value, description) VALUES
  ('shop_name', 'ROUKI', 'Nom de la boutique'),
  ('shop_email', 'contact@roukii.fr', 'Email de contact'),
  ('shop_phone', '+228 XX XX XX XX', 'Téléphone de contact'),
  ('default_currency', 'FCFA', 'Devise par défaut'),
  ('stock_alert_threshold', '5', 'Seuil d''alerte de stock bas');

-- Insertion d'un admin par défaut (mot de passe: admin123)
-- Note: Le hash doit être généré côté application avec bcrypt
INSERT INTO admins (email, password_hash, role) VALUES
  ('admin@roukii.fr', '$2a$10$placeholder_hash_to_be_replaced', 'ADMIN');

-- ============================================
-- 1️⃣1️⃣ POLITIQUES DE SÉCURITÉ (RLS)
-- ============================================

-- Activer RLS sur toutes les tables sensibles
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Politiques pour les CLIENTS (partie publique)
-- ============================================

-- Les clients peuvent voir les styles actifs
CREATE POLICY "Styles publics visibles" ON styles
  FOR SELECT USING (is_active = true);

-- Les clients peuvent voir les produits actifs
CREATE POLICY "Produits publics visibles" ON products
  FOR SELECT USING (is_active = true);

-- Les clients peuvent voir les tailles des produits actifs
CREATE POLICY "Tailles des produits publics visibles" ON product_sizes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_sizes.product_id
      AND p.is_active = true
    )
  );

-- Les clients peuvent voir les images des produits actifs
CREATE POLICY "Images des produits publics visibles" ON product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_images.product_id
      AND p.is_active = true
    )
  );

-- Les clients peuvent créer des customers (lors de la commande)
CREATE POLICY "Création de client autorisée" ON customers
  FOR INSERT WITH CHECK (true);

-- Les clients peuvent créer des commandes
CREATE POLICY "Création de commande autorisée" ON orders
  FOR INSERT WITH CHECK (true);

-- Les clients peuvent créer des items de commande
CREATE POLICY "Création d'items de commande autorisée" ON order_items
  FOR INSERT WITH CHECK (true);

-- ============================================
-- Politiques pour les ADMINS
-- ============================================

-- Note: Les politiques admin seront gérées via Supabase Auth
-- Pour l'instant, on crée des politiques permissives pour les admins authentifiés

-- Les admins peuvent tout faire sur toutes les tables
CREATE POLICY "Admins ont accès complet - admins" ON admins
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins ont accès complet - customers" ON customers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins ont accès complet - styles" ON styles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins ont accès complet - products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins ont accès complet - product_sizes" ON product_sizes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins ont accès complet - product_images" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins ont accès complet - orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins ont accès complet - order_items" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins ont accès complet - stock_movements" ON stock_movements
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins ont accès complet - email_logs" ON email_logs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins ont accès complet - settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 1️⃣2️⃣ VUES UTILITAIRES
-- ============================================

-- Vue: products_with_stock
-- Description: Produits avec leur stock total
CREATE OR REPLACE VIEW products_with_stock AS
SELECT 
  p.*,
  COALESCE(SUM(ps.stock_quantity), 0) as total_stock
FROM products p
LEFT JOIN product_sizes ps ON p.id = ps.product_id
GROUP BY p.id;

-- Vue: orders_with_profit
-- Description: Commandes avec leur bénéfice calculé
CREATE OR REPLACE VIEW orders_with_profit AS
SELECT 
  o.*,
  c.full_name as customer_name,
  c.phone_number as customer_phone,
  c.city as customer_city,
  COALESCE(SUM((oi.unit_price - oi.purchase_price) * oi.quantity), 0) as profit
FROM orders o
JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, c.id;

-- Vue: sales_stats
-- Description: Statistiques de ventes
CREATE OR REPLACE VIEW sales_stats AS
SELECT 
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE status = 'DELIVERED') as delivered_orders,
  COALESCE(SUM(total_amount) FILTER (WHERE status = 'DELIVERED'), 0) as total_revenue,
  COALESCE(SUM(
    (SELECT SUM((oi.unit_price - oi.purchase_price) * oi.quantity)
     FROM order_items oi
     WHERE oi.order_id = orders.id)
  ) FILTER (WHERE status = 'DELIVERED'), 0) as total_profit
FROM orders;

-- ============================================
-- ✅ FIN DE LA MIGRATION
-- ============================================

-- Commentaire final
COMMENT ON DATABASE postgres IS 'Base de données ROUKI E-Commerce - Marché togolais';
