# 🗄️ Base de données Supabase - ROUKI

## 📋 Vue d'ensemble

Cette base de données est conçue pour un e-commerce togolais avec :
- ✅ Paiement à la livraison uniquement
- ✅ Gestion de stock par taille
- ✅ Styles dynamiques (Streetwear, Casual, Corporate, etc.)
- ✅ Suivi des bénéfices sur commandes livrées
- ✅ Audit des mouvements de stock

---

## 🚀 Déploiement

### 1️⃣ Créer un projet Supabase

1. Aller sur [https://supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter votre **URL** et **anon key**

### 2️⃣ Exécuter la migration

#### Option A : Via l'interface Supabase (Recommandé pour débutants)

1. Aller dans **SQL Editor** dans votre projet Supabase
2. Créer une nouvelle query
3. Copier-coller tout le contenu de `/supabase/migrations/001_initial_schema.sql`
4. Cliquer sur **Run**

#### Option B : Via Supabase CLI (Recommandé pour production)

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier votre projet
supabase link --project-ref your-project-ref

# Exécuter la migration
supabase db push
```

### 3️⃣ Configurer l'authentification Admin

1. Aller dans **Authentication** > **Providers**
2. Activer **Email**
3. Désactiver **Confirm email** (pour simplifier)
4. Créer manuellement l'admin dans **Authentication** > **Users**:
   - Email: `admin@roukii.fr`
   - Password: `admin123` (à changer en production !)

---

## 📊 Structure de la base de données

### Tables principales

| Table | Description | Relations |
|-------|-------------|-----------|
| `admins` | Comptes administrateurs | - |
| `customers` | Clients (sans compte) | → orders |
| `styles` | Styles dynamiques | → products |
| `products` | Catalogue de produits | → product_sizes, product_images |
| `product_sizes` | Stock par taille | ← products |
| `product_images` | Images des produits | ← products |
| `orders` | Commandes | ← customers, → order_items |
| `order_items` | Détails des commandes | ← orders, ← products |
| `stock_movements` | Historique du stock | ← products |
| `email_logs` | Logs des emails | ← orders |
| `settings` | Configuration | - |

---

## 🔐 Sécurité (RLS)

### Partie publique (clients)
- ✅ Lecture des produits actifs
- ✅ Lecture des styles actifs
- ✅ Création de commandes
- ❌ Pas d'accès aux données admin

### Partie admin (authentifiés)
- ✅ Accès complet à toutes les tables
- ✅ Gestion des produits, commandes, styles

---

## 📈 Fonctions utilitaires

### `calculate_order_profit(order_uuid)`
Calcule le bénéfice d'une commande spécifique.

```sql
SELECT calculate_order_profit('uuid-de-la-commande');
```

### `get_product_total_stock(product_uuid)`
Retourne le stock total d'un produit (toutes tailles confondues).

```sql
SELECT get_product_total_stock('uuid-du-produit');
```

### Trigger automatique de stock
Lorsqu'une commande passe à `IN_DELIVERY`, le stock est **automatiquement déduit**.
Si elle est annulée, le stock est **restauré**.

---

## 🔄 Mapping avec l'interface actuelle

### Types TypeScript → Tables SQL

```typescript
// StyleCategory → styles
{
  id: string          → id (UUID)
  name: string        → name (TEXT)
  slug: string        → slug (TEXT)
  description: string → description (TEXT)
}

// Product → products + product_sizes + product_images
{
  id: string          → id (UUID)
  name: string        → name (TEXT)
  description: string → description (TEXT)
  gender: Gender      → gender (TEXT)
  style: string       → style_slug (TEXT)
  price: number       → selling_price (NUMERIC)
  costPrice: number   → purchase_price (NUMERIC)
  image: string       → product_images (is_main = true)
  images: string[]    → product_images[]
  sizes: []           → product_sizes[]
  isActive: boolean   → is_active (BOOLEAN)
  isFeatured: boolean → is_featured (BOOLEAN)
}

// Order → orders + customers + order_items
{
  id: string          → id (UUID)
  customerName: string → customers.full_name
  phone: string       → customers.phone_number
  city: string        → customers.city
  note: string        → customer_note (TEXT)
  items: CartItem[]   → order_items[]
  total: number       → total_amount (NUMERIC)
  status: OrderStatus → status (TEXT)
  createdAt: Date     → created_at (TIMESTAMPTZ)
}
```

### Statuts de commande

| Interface | Base de données |
|-----------|-----------------|
| `pending` | `PENDING_CONTACT` |
| `confirmed` | `CONFIRMED` |
| `delivering` | `IN_DELIVERY` |
| `delivered` | `DELIVERED` |
| `cancelled` | `CANCELLED` |

---

## 💰 Calcul des bénéfices

Les bénéfices sont calculés **uniquement** sur les commandes avec le statut `DELIVERED` :

```sql
-- Vue prête à l'emploi
SELECT * FROM orders_with_profit WHERE status = 'DELIVERED';

-- Ou statistiques globales
SELECT * FROM sales_stats;
```

**Formule** :
```
Bénéfice = Σ (unit_price - purchase_price) × quantity
```

---

## 📝 Exemples de requêtes

### Obtenir tous les produits actifs avec leur stock

```sql
SELECT * FROM products_with_stock 
WHERE is_active = true 
ORDER BY created_at DESC;
```

### Obtenir les commandes en attente

```sql
SELECT 
  o.*,
  c.full_name,
  c.phone_number
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'PENDING_CONTACT'
ORDER BY o.created_at DESC;
```

### Statistiques de ventes

```sql
SELECT * FROM sales_stats;
```

### Produits avec stock faible

```sql
SELECT 
  p.name,
  ps.size,
  ps.stock_quantity
FROM products p
JOIN product_sizes ps ON p.id = ps.product_id
WHERE ps.stock_quantity <= 5
AND p.is_active = true
ORDER BY ps.stock_quantity ASC;
```

---

## 🛠️ Maintenance

### Backup recommandé

```bash
# Via Supabase CLI
supabase db dump -f backup.sql

# Restaurer
supabase db reset
psql -h db.xxx.supabase.co -U postgres -f backup.sql
```

### Nettoyage des anciennes données

```sql
-- Supprimer les commandes annulées de plus de 6 mois
DELETE FROM orders 
WHERE status = 'CANCELLED' 
AND created_at < NOW() - INTERVAL '6 months';
```

---

## 🔗 Variables d'environnement

Créer un fichier `.env.local` :

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ Checklist de déploiement

- [ ] Projet Supabase créé
- [ ] Migration exécutée
- [ ] Admin créé dans Authentication
- [ ] Styles par défaut insérés
- [ ] Variables d'environnement configurées
- [ ] Test de connexion depuis l'app
- [ ] Politiques RLS vérifiées
- [ ] Backup initial créé

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

## 🆘 Support

En cas de problème :
1. Vérifier les logs Supabase dans **Database** > **Logs**
2. Vérifier les politiques RLS
3. Tester les requêtes dans SQL Editor
4. Consulter la documentation officielle

---

**Version** : 1.0.0  
**Date** : 22 décembre 2024  
**Projet** : ROUKI E-Commerce
