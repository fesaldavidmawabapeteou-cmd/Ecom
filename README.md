# 🛍️ ROUKI - E-commerce Togolais

<div align="center">

![ROUKI Logo](https://img.shields.io/badge/ROUKI-E--commerce-FF6B00?style=for-the-badge&logo=shopping-bag)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-3178C6?style=for-the-badge&logo=typescript)
![Status](https://img.shields.io/badge/Status-100%25%20Operational-success?style=for-the-badge)

**Application e-commerce complète pour le marché togolais**  
*Vêtements homme/femme • Paiement à la livraison • Design Liquid Glass*

[🚀 Démarrage](#-démarrage-rapide) • [📚 Documentation](#-documentation) • [🎯 Fonctionnalités](#-fonctionnalités) • [🛠️ Stack](#%EF%B8%8F-stack-technique)

</div>

---

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Démarrage rapide](#-démarrage-rapide)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#%EF%B8%8F-stack-technique)
- [Architecture](#-architecture)
- [Documentation](#-documentation)
- [Captures d'écran](#-captures-décran)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## 🎯 Vue d'ensemble

**ROUKI** est une plateforme e-commerce moderne et complète, spécialement conçue pour le marché togolais. L'application permet la vente de vêtements homme et femme avec un système de paiement à la livraison.

### ✨ Points forts

- 🎨 **Design Liquid Glass** unique et élégant
- 📱 **100% Responsive** - Mobile-first approach
- ⚡ **Performance optimale** avec Vite et React 18
- 🔒 **Backend sécurisé** Supabase avec KV Store
- 📊 **Dashboard admin** complet avec statistiques
- 🛒 **Expérience client** fluide sans inscription
- 🚀 **Prêt pour la production** avec documentation complète

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ installé
- Compte Supabase (gratuit)
- Git

### Installation

```bash
# 1. Cloner le projet
git clone [votre-repo]
cd rouki

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos credentials Supabase

# 4. Lancer en mode développement
npm run dev
```

### Accès Admin

- **URL**: `/admin/login`
- **Email**: `admin@roukii.fr`
- **Mot de passe**: `admin123`

⚠️ **Important**: Changez ces credentials en production !

---

## 🎯 Fonctionnalités

### Interface Client 🛒

- ✅ **Catalogue de produits** avec filtres (genre, style)
- ✅ **Détails produits** avec galerie d'images
- ✅ **Gestion du panier** en temps réel
- ✅ **Commande sans inscription** - Juste nom, téléphone, ville
- ✅ **Paiement à la livraison** - Adapté au marché local
- ✅ **Design responsive** mobile-first

### Interface Admin 👨‍💼

- ✅ **Dashboard KPI** - Chiffre d'affaires, commandes, bénéfices
- ✅ **Gestion des produits** - CRUD complet avec images
- ✅ **Gestion des commandes** - Suivi des statuts
- ✅ **Gestion des styles** - Catégories dynamiques
- ✅ **Statistiques avancées** - Graphiques et métriques
- ✅ **Calcul automatique** des marges et stocks

### Automatisations ⚙️

- 🔄 **Mise à jour des stocks** automatique lors des commandes
- 🔄 **Initialisation automatique** de la base de données
- 🔄 **Sauvegarde du panier** dans localStorage
- 🔄 **Notifications toast** pour toutes les actions

---

## 🛠️ Stack technique

### Frontend

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 18.3.1 | Framework UI |
| **React Router** | 7.11.0 | Navigation |
| **Tailwind CSS** | 4.1.12 | Styling |
| **TypeScript** | Latest | Type safety |
| **Vite** | 6.3.5 | Build tool |
| **Recharts** | 2.15.2 | Graphiques |
| **Sonner** | 2.0.3 | Notifications |
| **Lucide React** | 0.487.0 | Icônes |

### Backend

| Technologie | Usage |
|------------|-------|
| **Supabase** | Infrastructure BaaS |
| **Deno** | Runtime Edge Functions |
| **Hono** | Framework web |
| **KV Store** | Base de données |

### Design

- **Design System**: Liquid Glass / Frozen Glass
- **Palette**: Orange (#FF6B00), Blanc, Noir
- **Border Radius**: 1.5rem (ultra-arrondi)
- **Typography**: System fonts optimisées

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│   React + Tailwind CSS + TypeScript                 │
│                                                      │
│   ┌──────────────────────────────────────┐         │
│   │         Context API                   │         │
│   │    (State Management Global)          │         │
│   └──────────────┬───────────────────────┘         │
│                  │                                   │
│   ┌──────────────▼───────────────────────┐         │
│   │         useApi Hook                   │         │
│   │    (Fetch wrapper + Auth)             │         │
│   └──────────────┬───────────────────────┘         │
└─────────────────┬┬───────────────────────────────┘
                  ││
                  ││ HTTPS
                  ││
┌─────────────────▼▼───────────────────────────────┐
│              SUPABASE BACKEND                     │
│                                                   │
│   ┌─────────────────────────────────┐           │
│   │   Edge Function (Deno)          │           │
│   │   • Hono Web Server             │           │
│   │   • API REST Routes             │           │
│   │   • CORS & Auth                 │           │
│   └──────────────┬──────────────────┘           │
│                  │                                │
│   ┌──────────────▼──────────────────┐           │
│   │      KV Store Database          │           │
│   │   • products:${id}              │           │
│   │   • orders:${id}                │           │
│   │   • styles:${id}                │           │
│   │   • admin:credentials           │           │
│   └─────────────────────────────────┘           │
└───────────────────────────────────────────────────┘
```

### Flux de données

1. **Utilisateur** interagit avec l'UI React
2. **Context API** gère l'état global
3. **useApi** envoie les requêtes au backend
4. **Hono Server** traite les requêtes
5. **KV Store** persiste les données
6. **Réponse** remonte jusqu'à l'UI

---

## 📚 Documentation

### Guides principaux

- 📖 [**GUIDE_DEMARRAGE.md**](./GUIDE_DEMARRAGE.md) - Guide de démarrage rapide
- 🏗️ [**BACKEND_ARCHITECTURE.md**](./BACKEND_ARCHITECTURE.md) - Architecture détaillée du backend
- 🚀 [**DEPLOIEMENT_SUPABASE.md**](./DEPLOIEMENT_SUPABASE.md) - Guide de déploiement
- 📋 [**PROJECT_SUMMARY.md**](./PROJECT_SUMMARY.md) - Résumé complet du projet
- ✅ [**CHECKLIST.md**](./CHECKLIST.md) - Checklist de vérification

### API & Configuration

- 🔌 [**API_COLLECTION.json**](./API_COLLECTION.json) - Collection Postman/Thunder Client
- 🔐 [**.env.example**](./.env.example) - Template variables d'environnement

### Structure du code

```
/src
├── app/
│   ├── components/      # Composants React
│   ├── context/         # Context API
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Pages de l'app
│   └── App.tsx          # Root component
├── lib/                 # Bibliothèques
├── styles/              # CSS & Design System
└── imports/             # Assets importés

/supabase
└── functions/
    └── server/
        ├── index.tsx        # Serveur Hono
        └── kv_store.tsx     # Utilitaires KV

/utils
└── supabase/
    └── info.tsx         # Configuration
```

---

## 📸 Captures d'écran

### Interface Client

**Page d'accueil**
- Hero section avec appel à l'action
- Carousel de styles
- Produits en vedette

**Catalogue**
- Grid responsive
- Filtres genre + style
- Compteur de résultats

**Détail produit**
- Galerie d'images
- Sélecteur de taille
- Gestion du stock

### Interface Admin

**Dashboard**
- KPIs en temps réel
- Graphiques interactifs
- Dernières commandes

**Gestion produits**
- Liste complète
- Modal de création/édition
- Upload d'images

**Statistiques**
- Chiffre d'affaires
- Top produits
- Graphiques avancés

---

## 🚀 D��ploiement

### Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier le Project ID et l'Anon Key
3. Configurer les variables d'environnement
4. Déployer l'Edge Function

```bash
# Installation Supabase CLI
npm install -g supabase

# Login
supabase login

# Déploiement
supabase functions deploy make-server-643ea828
```

Consultez [DEPLOIEMENT_SUPABASE.md](./DEPLOIEMENT_SUPABASE.md) pour le guide complet.

### Variables d'environnement

```env
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🧪 Tests

### Tests manuels recommandés

#### Interface Client
1. Parcourir le catalogue
2. Filtrer par genre et style
3. Ajouter 3 produits au panier
4. Modifier les quantités
5. Créer une commande test
6. Vérifier l'ID de commande

#### Interface Admin
1. Se connecter avec les credentials
2. Vérifier le dashboard
3. Créer un nouveau produit
4. Modifier un produit existant
5. Changer le statut d'une commande
6. Créer un nouveau style
7. Consulter les statistiques

### Tests API (avec curl)

```bash
# Health check
curl https://[project-id].supabase.co/functions/v1/make-server-643ea828/health

# Récupérer les produits
curl https://[project-id].supabase.co/functions/v1/make-server-643ea828/products \
  -H "Authorization: Bearer [anon-key]"
```

Voir [API_COLLECTION.json](./API_COLLECTION.json) pour tous les exemples.

---

## 🐛 Debugging

### Console navigateur
Ouvrir les DevTools (F12) pour voir :
- Logs des appels API
- Erreurs détaillées
- State du Context

### Logs Supabase
Dashboard Supabase → Functions → Logs

### Réinitialiser l'application
```javascript
// Dans la console du navigateur
localStorage.clear()
location.reload()
```

---

## 🔒 Sécurité

### ⚠️ Avant la production

- [ ] Hasher les mots de passe (bcrypt)
- [ ] Implémenter Supabase Auth avec JWT
- [ ] Ajouter rate limiting
- [ ] Valider et sanitiser toutes les entrées
- [ ] Configurer CSP headers
- [ ] HTTPS uniquement
- [ ] Changer les credentials admin par défaut
- [ ] Activer monitoring et alertes

---

## 🤝 Contribution

Ce projet est privé. Pour toute question ou suggestion :

1. Ouvrir une issue
2. Proposer une pull request
3. Contacter l'équipe

---

## 📄 Licence

Tous droits réservés © 2026 ROUKI

---

## 🙏 Remerciements

- **Design inspiration**: Liquid Glass pattern
- **Images**: Unsplash
- **Icons**: Lucide React
- **Framework**: React Team
- **Styling**: Tailwind CSS
- **Backend**: Supabase Team

---

## 📞 Support

Pour toute question :
- 📧 Email: admin@roukii.fr
- 📱 Téléphone: +228 XX XX XX XX
- 📍 Adresse: Lomé, Togo

---

<div align="center">

**Fait avec ❤️ pour le marché togolais**

[⬆ Retour en haut](#-rouki---e-commerce-togolais)

</div>
