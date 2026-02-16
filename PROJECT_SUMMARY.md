# 📦 ROUKI - E-commerce Complet

## 🎯 Vue d'ensemble

**ROUKI** est une application e-commerce complète pour le marché togolais, spécialisée dans la vente de vêtements homme/femme avec paiement à la livraison.

### 🌟 Caractéristiques principales

✅ **Frontend moderne** avec React + Tailwind CSS  
✅ **Backend Supabase** avec KV Store  
✅ **Design Liquid Glass** unique et élégant  
✅ **Responsive 100%** mobile-first  
✅ **Interface Admin** complète  
✅ **Gestion des stocks** en temps réel  
✅ **Statistiques avancées** avec graphiques  

---

## 📁 Structure du projet

```
/
├── src/
│   ├── app/
│   │   ├── components/       # Composants React réutilisables
│   │   │   ├── ui/          # Composants UI (shadcn)
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFormModal.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── context/
│   │   │   └── StoreContext.tsx  # Context API (state management)
│   │   ├── hooks/
│   │   │   └── useApi.ts         # Hook API Supabase
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Page d'accueil
│   │   │   ���── Catalog.tsx       # Catalogue produits
│   │   │   ├── ProductDetail.tsx # Détail produit
│   │   │   ├── Cart.tsx          # Panier
│   │   │   ├── Checkout.tsx      # Tunnel de commande
│   │   │   └── admin/            # Pages admin
│   │   │       ├── AdminLogin.tsx
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── AdminProducts.tsx
│   │   │       ├── AdminOrders.tsx
│   │   │       ├── AdminStyles.tsx
│   │   │       └── AdminStats.tsx
│   │   └── App.tsx               # Root component
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts         # Client Supabase
│   │       └── types.ts          # Types TypeScript
│   └── styles/
│       ├── theme.css             # Design system
│       ├── fonts.css             # Polices
│       ├── index.css             # Styles globaux
│       └── tailwind.css          # Tailwind config
│
├── supabase/
│   ├── functions/
│   │   └── server/
│   │       ├── index.tsx         # Serveur Hono (API REST)
│   │       └── kv_store.tsx      # Utilitaires KV Store (protégé)
│   └── migrations/
│       └── 001_initial_schema.sql  # Schema SQL (référence)
│
├── utils/
│   └── supabase/
│       └── info.tsx              # Config Supabase
│
├── BACKEND_ARCHITECTURE.md       # Documentation backend
├── GUIDE_DEMARRAGE.md           # Guide de démarrage
├── DEPLOIEMENT_SUPABASE.md      # Guide déploiement
├── package.json
└── vite.config.ts
```

---

## 🚀 Stack Technique

### Frontend
| Technologie | Version | Usage |
|------------|---------|-------|
| React | 18.3.1 | Framework UI |
| React Router | 7.11.0 | Routing |
| Tailwind CSS | 4.1.12 | Styling |
| TypeScript | - | Type safety |
| Vite | 6.3.5 | Build tool |
| Recharts | 2.15.2 | Graphiques |
| Sonner | 2.0.3 | Notifications |
| Lucide React | 0.487.0 | Icônes |

### Backend
| Technologie | Usage |
|------------|-------|
| Deno | Runtime serveur |
| Hono | Framework web |
| Supabase | Infrastructure |
| KV Store | Base de données |

---

## 🎨 Design System

### Palette de couleurs
```css
--orange-primary: #FF6B00
--orange-light: #FF8533
--white: #FFFFFF
--black: #030213
--gray-light: #F3F3F5
```

### Effets Liquid Glass
- `.glass` - Effet verre principal
- `.glass-card` - Cartes avec effet verre
- `.glass-button` - Boutons vitrés
- `.glass-input` - Inputs avec effet

### Radius
```css
--radius: 1.5rem  /* Bords ultra-arrondis */
```

---

## 🗄️ Base de données (KV Store)

### Collections

#### Products (`products:${id}`)
```typescript
{
  id: string;
  name: string;
  description: string;
  gender: 'homme' | 'femme';
  style: string;  // slug du style
  price: number;
  costPrice: number;
  image: string;
  images?: string[];
  mainImageIndex?: number;
  sizes: { size: string; stock: number }[];
  isActive?: boolean;
  isFeatured?: boolean;
}
```

#### Orders (`orders:${id}`)
```typescript
{
  id: string;  // Format: ORD-timestamp
  customerName: string;
  phone: string;
  city?: string;
  note?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled';
  createdAt: string;  // ISO 8601
}
```

#### Styles (`styles:${id}`)
```typescript
{
  id: string;
  name: string;
  slug: string;
  description?: string;
}
```

#### Admin (`admin:credentials`)
```typescript
{
  email: string;
  password: string;  // ⚠️ En clair (prototype)
}
```

---

## 🔌 API Routes

### Products
```
GET    /products          Liste tous les produits
GET    /products/:id      Récupère un produit
POST   /products          Crée un produit
PUT    /products/:id      Modifie un produit
DELETE /products/:id      Supprime un produit
```

### Orders
```
GET    /orders            Liste toutes les commandes
GET    /orders/:id        Récupère une commande
POST   /orders            Crée une commande
PUT    /orders/:id/status Modifie le statut
```

### Styles
```
GET    /styles            Liste tous les styles
POST   /styles            Crée un style
PUT    /styles/:id        Modifie un style
DELETE /styles/:id        Supprime un style
```

### Stats
```
GET    /stats             Statistiques complètes
```

### Admin
```
POST   /admin/login       Authentification admin
```

---

## 🔐 Authentification

### Interface Client
Aucune authentification requise. Les clients peuvent commander sans compte.

### Interface Admin
- Route: `/admin/login`
- Credentials par défaut:
  - Email: `admin@roukii.fr`
  - Password: `admin123`
- Stockage: `localStorage` (session persistante)

---

## 🛒 Flux de commande

### Parcours Client

1. **Découverte** → Page d'accueil avec produits en vedette
2. **Navigation** → Catalogue avec filtres (genre, style)
3. **Sélection** → Détail produit avec choix de taille
4. **Panier** → Ajout de produits avec quantités
5. **Commande** → Formulaire (nom, téléphone, ville, note)
6. **Confirmation** → ID de commande généré

### Traitement Admin

1. **Réception** → Commande créée avec statut `pending`
2. **Confirmation** → Admin valide → `confirmed`
3. **Préparation** → Produit en livraison → `delivering`
4. **Livraison** → Client reçoit ��� `delivered`
5. **Paiement** → À la livraison

---

## 📊 Statistiques disponibles

### KPIs Dashboard
- Nombre total de commandes
- Commandes en attente
- Commandes livrées
- Chiffre d'affaires total
- Bénéfices nets
- Stock total

### Graphiques
- Évolution du CA (7 derniers jours)
- Répartition des ventes par style (Pie chart)
- Top 5 des produits les plus vendus

### Métriques calculées
- Marge moyenne (%)
- Taux de conversion
- Valeur moyenne par commande
- Stock par produit

---

## 🎯 Fonctionnalités par page

### `/` - Accueil
- Hero section avec CTA
- Carousel de styles
- Produits en vedette
- Footer avec info contact

### `/catalog` - Catalogue
- Filtres: Genre + Style
- Grid responsive de produits
- Compteur de résultats
- Navigation rapide

### `/product/:id` - Détail
- Galerie d'images
- Sélecteur de taille avec stocks
- Ajout au panier
- Description complète
- Prix formaté en Francs CFA

### `/cart` - Panier
- Liste des articles
- Modification quantités
- Suppression d'articles
- Calcul total automatique
- Bouton vers checkout

### `/checkout` - Commande
- Formulaire client (nom, tel, ville, note)
- Récapitulatif de commande
- Validation et création
- Redirection avec ID de commande

### `/admin/dashboard` - Dashboard
- Vue d'ensemble des KPIs
- Dernières commandes
- Graphiques en temps réel
- Liens rapides

### `/admin/products` - Gestion produits
- Liste complète avec stocks
- Filtres et recherche
- Modal de création/édition
- Upload d'images
- Gestion des tailles
- Calcul de marge

### `/admin/orders` - Gestion commandes
- Liste avec filtres de statut
- Changement de statut
- Détails complets
- Historique client

### `/admin/styles` - Gestion styles
- CRUD complet des catégories
- Styles dynamiques dans les filtres
- Validation des slugs

### `/admin/stats` - Statistiques
- Métriques détaillées
- Charts interactifs
- Export de données

---

## 🧩 Composants clés

### `<Header />`
Navigation principale avec logo, liens, et icône panier avec badge.

### `<Footer />`
Informations de contact, réseaux sociaux, copyright.

### `<ProductCard />`
Carte produit réutilisable pour catalogue et accueil.

### `<ProductFormModal />`
Modal complexe pour créer/modifier un produit avec upload d'images.

### `<AdminLayout />`
Layout admin avec sidebar et navigation.

### `StoreContext`
Context React gérant tout l'état global de l'application.

---

## 🔄 State Management

### Context API Structure
```typescript
StoreContext
├── products[]        # Liste des produits
├── orders[]          # Liste des commandes
├── styles[]          # Liste des styles
├── cart[]            # Panier (localStorage)
├── isAdmin           # État authentification
├── loading           # État de chargement
├── addToCart()       # Méthode panier
├── createOrder()     # Méthode commande
├── updateProduct()   # Méthode CRUD
└── refreshData()     # Recharger données
```

### Flux de données
```
Component
   ↓
useStore() hook
   ↓
StoreContext
   ↓
api.* functions
   ↓
Supabase Backend
   ↓
KV Store
```

---

## 🚦 État du projet

### ✅ Fonctionnalités complètes
- [x] Interface client responsive
- [x] Catalogue avec filtres
- [x] Panier et commande
- [x] Backend Supabase complet
- [x] Interface admin
- [x] Gestion des produits (CRUD)
- [x] Gestion des commandes
- [x] Gestion des styles dynamiques
- [x] Statistiques avec graphiques
- [x] Design Liquid Glass
- [x] Optimisation mobile

### 🔜 Améliorations possibles
- [ ] Upload d'images vers Supabase Storage
- [ ] Authentification Supabase Auth
- [ ] Notifications email/SMS
- [ ] Recherche avancée
- [ ] Favoris et wishlist
- [ ] Avis clients
- [ ] Programme de fidélité
- [ ] Export de données

---

## 📱 Responsive Design

### Breakpoints Tailwind
```css
sm: 640px   /* Mobile landscape / Small tablet */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Stratégie Mobile-First
- Design pensé d'abord pour mobile
- Progressive enhancement pour desktop
- Touch-friendly (boutons min 44px)
- Navigation simplifiée
- Images optimisées

---

## 🧪 Tests

### Test manuel recommandé
1. Parcourir le catalogue
2. Ajouter 3 produits au panier
3. Modifier les quantités
4. Créer une commande
5. Se connecter à l'admin
6. Changer le statut de la commande
7. Ajouter un nouveau produit
8. Créer un nouveau style
9. Vérifier les statistiques

### Console Browser
Les logs sont activés pour faciliter le debugging:
- Appels API loggés
- Erreurs explicites
- State changes visibles

---

## 📦 Déploiement

### Prérequis
- Compte Supabase
- Projet Supabase créé
- Variables d'environnement configurées

### Étapes (voir DEPLOIEMENT_SUPABASE.md)
1. Push du code
2. Configuration Supabase
3. Déploiement Edge Function
4. Configuration DNS (optionnel)
5. Tests de production

---

## 🆘 Support & Debugging

### Logs
- Browser Console (F12)
- Supabase Dashboard → Functions → Logs
- Network tab pour les requêtes API

### Commandes utiles
```bash
# Test health endpoint
curl https://[project-id].supabase.co/functions/v1/make-server-643ea828/health

# Reset localStorage (panier)
localStorage.clear()
```

---

## 📄 Licence

Projet privé - Tous droits réservés

---

## 👥 Crédits

- **Design**: Liquid Glass pattern
- **Images**: Unsplash
- **Icons**: Lucide React
- **Framework**: React + Tailwind CSS
- **Backend**: Supabase + Hono

---

## 🎉 Conclusion

ROUKI est une application e-commerce complète, prête à l'emploi, avec un design moderne et une architecture solide. Parfaite pour le marché togolais avec paiement à la livraison.

**Bon développement ! 🚀**
