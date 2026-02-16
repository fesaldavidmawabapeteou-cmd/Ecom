# Backend ROUKI - Architecture & Documentation

## 🏗️ Architecture

L'application ROUKI utilise une architecture backend complète basée sur **Supabase KV Store** et **Hono** (framework web pour Deno).

### Stack Technique
- **Runtime**: Deno (Edge Functions Supabase)
- **Framework Web**: Hono
- **Base de données**: Supabase KV Store
- **Frontend**: React + Context API

## 📂 Structure des données

### Préfixes KV Store
```
products:${id}     → Produits
orders:${id}       → Commandes
styles:${id}       → Catégories de style
admin:credentials  → Identifiants admin
system:initialized → Flag d'initialisation
```

## 🔌 API Endpoints

### Base URL
```
https://${projectId}.supabase.co/functions/v1/make-server-643ea828
```

### Authentication
Tous les endpoints nécessitent le header:
```
Authorization: Bearer ${publicAnonKey}
```

---

## 📋 Endpoints Détaillés

### Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-15T10:30:00.000Z"
}
```

---

### 🔐 Admin Auth

#### Login Admin
```
POST /admin/login
```
**Body:**
```json
{
  "email": "admin@roukii.fr",
  "password": "admin123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "admin": {
    "email": "admin@roukii.fr"
  }
}
```

---

### 📦 Products

#### Récupérer tous les produits
```
GET /products
```
**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "1",
      "name": "T-Shirt Streetwear Premium",
      "description": "...",
      "gender": "homme",
      "style": "streetwear",
      "price": 15000,
      "costPrice": 8000,
      "image": "...",
      "sizes": [
        { "size": "S", "stock": 10 },
        { "size": "M", "stock": 15 }
      ]
    }
  ]
}
```

#### Récupérer un produit
```
GET /products/:id
```

#### Créer un produit
```
POST /products
```
**Body:**
```json
{
  "name": "Nouveau produit",
  "description": "Description",
  "gender": "homme",
  "style": "streetwear",
  "price": 15000,
  "costPrice": 8000,
  "image": "https://...",
  "sizes": [
    { "size": "S", "stock": 10 }
  ]
}
```

#### Modifier un produit
```
PUT /products/:id
```
**Body:** Partial update

#### Supprimer un produit
```
DELETE /products/:id
```

---

### 🛍️ Orders

#### Récupérer toutes les commandes
```
GET /orders
```
**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "ORD-1739611234567",
      "customerName": "Jean Dupont",
      "phone": "90123456",
      "city": "Lomé",
      "items": [...],
      "total": 45000,
      "status": "pending",
      "createdAt": "2026-02-15T10:30:00.000Z"
    }
  ]
}
```

#### Créer une commande
```
POST /orders
```
**Body:**
```json
{
  "customerName": "Jean Dupont",
  "phone": "90123456",
  "city": "Lomé",
  "note": "Livraison rapide",
  "items": [
    {
      "product": { /* product object */ },
      "size": "M",
      "quantity": 2
    }
  ],
  "total": 30000
}
```

⚠️ **Important:** La création d'une commande met automatiquement à jour les stocks des produits.

#### Modifier le statut d'une commande
```
PUT /orders/:id/status
```
**Body:**
```json
{
  "status": "confirmed"
}
```
**Statuts possibles:**
- `pending` - En attente
- `confirmed` - Confirmée
- `delivering` - En livraison
- `delivered` - Livrée
- `cancelled` - Annulée

---

### 🎨 Styles

#### Récupérer tous les styles
```
GET /styles
```

#### Créer un style
```
POST /styles
```
**Body:**
```json
{
  "name": "Sport",
  "slug": "sport",
  "description": "Style sportif et dynamique"
}
```

#### Modifier un style
```
PUT /styles/:id
```

#### Supprimer un style
```
DELETE /styles/:id
```

---

### 📊 Stats

#### Récupérer les statistiques
```
GET /stats
```
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalRevenue": 450000,
    "totalOrders": 15,
    "pendingOrders": 3,
    "deliveredOrders": 10,
    "totalProducts": 6,
    "activeProducts": 6,
    "totalStock": 150,
    "profit": 120000,
    "ordersByStatus": {
      "pending": 3,
      "confirmed": 1,
      "delivering": 1,
      "delivered": 10,
      "cancelled": 0
    },
    "recentOrdersCount": 5,
    "revenueByDay": [
      {
        "date": "2026-02-15",
        "revenue": 45000,
        "orders": 2
      }
    ]
  }
}
```

---

## 🚀 Initialisation Automatique

Au démarrage du serveur, une fonction `initializeDefaultData()` vérifie si la base est vide et initialise automatiquement:

- ✅ 3 styles par défaut (Streetwear, Casual, Corporate)
- ✅ 6 produits de démonstration
- ✅ Identifiants admin par défaut

**Identifiants admin:**
- Email: `admin@roukii.fr`
- Mot de passe: `admin123`

---

## 🔄 Gestion des stocks

Lorsqu'une commande est créée via `POST /orders`:
1. La commande est enregistrée dans le KV store
2. Pour chaque produit commandé, le stock est automatiquement décrémenté
3. Le stock ne peut pas devenir négatif (minimum: 0)

Exemple:
```
Avant commande: T-shirt M → stock: 15
Commande: 2 × T-shirt M
Après commande: T-shirt M → stock: 13
```

---

## 📈 Utilisation Frontend

### Hook personnalisé `useApi`
```typescript
import { api } from '../hooks/useApi';

// Récupérer les produits
const products = await api.getProducts();

// Créer une commande
const response = await api.createOrder(orderData);

// Login admin
const result = await api.adminLogin(email, password);
```

### Context API
Le `StoreContext` gère toute la logique de communication avec le backend:
```typescript
import { useStore } from '../context/StoreContext';

const { 
  products,      // Liste des produits
  orders,        // Liste des commandes
  styles,        // Liste des styles
  cart,          // Panier (localStorage)
  loading,       // État de chargement
  addToCart,     // Ajouter au panier
  createOrder,   // Créer une commande
  updateProduct, // Mettre à jour un produit
  // ...
} = useStore();
```

---

## 🔒 Sécurité

### ⚠️ Points d'attention
1. Les mots de passe admin sont stockés en clair (OK pour prototype, à hacher en production)
2. Pas d'authentification JWT (utiliser Supabase Auth en production)
3. Les API Keys sont exposées côté client (normal pour Supabase Anon Key)

### ✅ Bonnes pratiques appliquées
- CORS configuré correctement
- Logs détaillés pour debugging
- Gestion d'erreurs avec messages explicites
- Validation des données d'entrée
- Réponses structurées avec `success` flag

---

## 🧪 Tests

### Test du backend
```bash
# Health check
curl https://${projectId}.supabase.co/functions/v1/make-server-643ea828/health

# Récupérer les produits
curl https://${projectId}.supabase.co/functions/v1/make-server-643ea828/products \
  -H "Authorization: Bearer ${publicAnonKey}"
```

---

## 📝 Notes de développement

### KV Store Structure
- Utilise des préfixes pour organiser les données
- `getByPrefix()` permet de récupérer tous les éléments d'un type
- Pas de relations complexes (denormalisé)
- Les commandes contiennent les produits complets (snapshot)

### Pourquoi snapshot les produits dans les commandes?
Lorsqu'une commande est créée, le produit complet est copié dans `order.items[].product`. Cela permet de conserver l'historique exact même si le produit est modifié/supprimé plus tard.

---

## 🎯 Prochaines étapes recommandées

1. **Authentification robuste**: Implémenter Supabase Auth avec JWT
2. **Upload d'images**: Utiliser Supabase Storage pour les images produits
3. **Validation**: Ajouter Zod pour valider les schemas
4. **Rate limiting**: Protection contre les abus
5. **Webhooks**: Notifications automatiques (email/SMS) pour les commandes
6. **Backup**: Système de sauvegarde du KV store
7. **Analytics**: Tracking détaillé des conversions
8. **Recherche**: Endpoint de recherche avancée avec filtres

---

## 🆘 Troubleshooting

### Erreur: "KV store not initialized"
→ Le serveur initialise automatiquement au démarrage. Attendre quelques secondes.

### Erreur: "CORS policy"
→ Vérifier que le header `Authorization` est bien envoyé.

### Erreur: "Product not found"
→ Vérifier que l'ID produit existe dans le KV store.

### Stocks incohérents
→ Les commandes décrémentent automatiquement les stocks. Vérifier les logs serveur.

---

## 📞 Support

Pour toute question sur l'architecture backend:
- Consulter les logs Supabase Edge Functions
- Vérifier le fichier `/supabase/functions/server/index.tsx`
- Tester les endpoints avec curl/Postman

---

**Version**: 1.0.0  
**Date**: 15 février 2026  
**Auteur**: Backend ROUKI
