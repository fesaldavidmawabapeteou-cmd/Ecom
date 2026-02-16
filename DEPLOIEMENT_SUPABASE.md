# 🚀 Guide de Déploiement Supabase - ROUKI

## 📖 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Étape 1 : Créer un projet Supabase](#étape-1--créer-un-projet-supabase)
4. [Étape 2 : Exécuter la migration](#étape-2--exécuter-la-migration)
5. [Étape 3 : Configurer l'authentification](#étape-3--configurer-lauthentification)
6. [Étape 4 : Configurer l'application](#étape-4--configurer-lapplication)
7. [Étape 5 : Tester la connexion](#étape-5--tester-la-connexion)
8. [Prochaines étapes](#prochaines-étapes)

---

## 🎯 Vue d'ensemble

Cette migration configure une base de données PostgreSQL complète pour l'application ROUKI avec :
- ✅ **11 tables** (admins, customers, styles, products, product_sizes, product_images, orders, order_items, stock_movements, email_logs, settings)
- ✅ **Triggers automatiques** (updated_at, gestion de stock)
- ✅ **Fonctions SQL** (calcul de bénéfices, stock total)
- ✅ **Vues** (products_with_stock, orders_with_profit, sales_stats)
- ✅ **Politiques RLS** (sécurité des données)

---

## 🔧 Prérequis

- ✅ Compte Supabase (gratuit sur [supabase.com](https://supabase.com))
- ✅ Node.js installé (pour l'application React)
- ✅ Fichiers du projet ROUKI

---

## 🆕 Étape 1 : Créer un projet Supabase

### 1.1 Créer le projet

1. Aller sur [https://app.supabase.com](https://app.supabase.com)
2. Cliquer sur **"New project"**
3. Remplir les informations :
   - **Name** : `rouki-ecommerce`
   - **Database Password** : Générer un mot de passe fort (le sauvegarder !)
   - **Region** : Choisir la plus proche (ex: `eu-west-1` pour l'Europe)
   - **Pricing Plan** : Free tier (suffisant pour commencer)
4. Cliquer sur **"Create new project"**
5. ⏳ Attendre 1-2 minutes que le projet se crée

### 1.2 Récupérer les informations de connexion

Une fois le projet créé :

1. Aller dans **Settings** → **API**
2. Noter ces 2 valeurs :
   - **Project URL** : `https://xxx.supabase.co`
   - **anon public** key : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 📝 Étape 2 : Exécuter la migration

### 2.1 Ouvrir le SQL Editor

1. Dans votre projet Supabase, aller dans **SQL Editor** (menu latéral)
2. Cliquer sur **"+ New query"**

### 2.2 Exécuter le script de migration

1. Ouvrir le fichier `/supabase/migrations/001_initial_schema.sql`
2. **Copier l'intégralité du fichier** (Ctrl+A, Ctrl+C)
3. **Coller** dans le SQL Editor de Supabase
4. Cliquer sur **"Run"** (ou Ctrl+Enter)
5. ✅ Vérifier qu'il n'y a pas d'erreurs (vous devriez voir "Success" en vert)

### 2.3 Vérifier la création des tables

1. Aller dans **Table Editor** (menu latéral)
2. Vous devriez voir toutes les tables :
   - ✅ admins
   - ✅ customers
   - ✅ styles (avec 3 lignes : Streetwear, Casual, Corporate)
   - ✅ products
   - ✅ product_sizes
   - ✅ product_images
   - ✅ orders
   - ✅ order_items
   - ✅ stock_movements
   - ✅ email_logs
   - ✅ settings (avec 5 lignes de configuration)

---

## 🔐 Étape 3 : Configurer l'authentification

### 3.1 Créer un compte admin

#### Option A : Via l'interface Supabase (Recommandé)

1. Aller dans **Authentication** → **Users**
2. Cliquer sur **"Add user"** → **"Create new user"**
3. Remplir :
   - **Email** : `admin@roukii.fr`
   - **Password** : `admin123` (ou votre mot de passe sécurisé)
   - **Auto Confirm User** : ✅ Cocher
4. Cliquer sur **"Create user"**

#### Option B : Via SQL (Alternative)

```sql
-- Dans le SQL Editor, exécuter :
-- 1. Installer pgcrypto si pas déjà fait
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Créer l'utilisateur avec un hash bcrypt
UPDATE admins 
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE email = 'admin@roukii.fr';
```

### 3.2 Configurer les paramètres d'authentification

1. Aller dans **Authentication** → **Providers**
2. **Email** doit être activé
3. Aller dans **Authentication** → **Settings**
4. Désactiver **"Confirm email"** pour simplifier (ou configurer un service d'email)

---

## ⚙️ Étape 4 : Configurer l'application

### 4.1 Créer le fichier `.env.local`

1. À la racine du projet ROUKI, créer `.env.local`
2. Copier le contenu de `.env.example`
3. Remplir avec vos valeurs :

```env
# Remplacer par VOS valeurs de l'étape 1.2
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.votre_anon_key
```

### 4.2 Installer les dépendances

Si ce n'est pas déjà fait :

```bash
npm install
```

Le package `@supabase/supabase-js` est déjà installé ! ✅

---

## ✅ Étape 5 : Tester la connexion

### 5.1 Test rapide dans le navigateur

1. Démarrer l'application :
   ```bash
   npm run dev
   ```

2. Ouvrir la console navigateur (F12)

3. Dans la console, tester la connexion :
   ```javascript
   // Importer le client
   const { supabase } = await import('/src/lib/supabase/client.ts');
   
   // Tester la connexion
   const { data, error } = await supabase.from('styles').select('*');
   console.log('Styles:', data);
   ```

4. ✅ Vous devriez voir les 3 styles (Streetwear, Casual, Corporate)

### 5.2 Test de connexion admin

1. Aller sur `http://localhost:5173/admin/login`
2. Se connecter avec :
   - Email : `admin@roukii.fr`
   - Password : `admin123`
3. ✅ Vous devriez accéder au dashboard admin

---

## 🎉 Prochaines étapes

Votre base de données est maintenant prête ! Voici ce que vous pouvez faire ensuite :

### 📦 Fonctionnalités à implémenter

1. **Remplacer les données mock par Supabase**
   - Modifier `StoreContext.tsx` pour utiliser Supabase au lieu des données en mémoire
   - Créer les hooks React pour les opérations CRUD
   - Gérer l'état avec React Query (optionnel mais recommandé)

2. **Upload d'images**
   - Utiliser Supabase Storage pour stocker les images produits
   - Configurer les buckets public/private
   - Implémenter l'upload dans ProductFormModal

3. **Emails transactionnels**
   - Configurer un service d'email (SendGrid, Mailgun, etc.)
   - Créer des templates d'email pour les commandes
   - Implémenter l'envoi automatique

4. **Optimisations**
   - Ajouter des index supplémentaires si besoin
   - Mettre en place un système de cache
   - Implémenter la pagination pour les grandes listes

### 🔒 Sécurité en production

**⚠️ IMPORTANT : Avant de déployer en production :**

1. **Changer tous les mots de passe** :
   - Admin : `admin@roukii.fr` / `admin123` → Mot de passe fort
   - Base de données : Utiliser le mot de passe généré par Supabase

2. **Revoir les politiques RLS** :
   - Affiner les permissions par rôle
   - Tester chaque politique

3. **Configurer SMTP** :
   - Pour la confirmation d'email
   - Pour les notifications de commandes

4. **Variables d'environnement** :
   - Ne JAMAIS commit `.env.local`
   - Utiliser des variables d'environnement sur votre plateforme de déploiement

---

## 📚 Ressources utiles

- 📖 [Documentation Supabase](https://supabase.com/docs)
- 🔐 [Guide RLS](https://supabase.com/docs/guides/auth/row-level-security)
- 💾 [Supabase Storage](https://supabase.com/docs/guides/storage)
- 🔄 [Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- 📧 [SMTP Setup](https://supabase.com/docs/guides/auth/auth-smtp)

---

## 🆘 Dépannage

### Erreur : "useStore must be used within StoreProvider"

✅ **Solution** : Vérifier que le `BrowserRouter` est AVANT le `StoreProvider` dans `App.tsx` (déjà corrigé)

### Erreur : "relation does not exist"

✅ **Solution** : La migration n'a pas été exécutée correctement. Réexécuter le script SQL.

### Erreur : "password authentication failed"

✅ **Solution** : Le compte admin n'existe pas dans `auth.users`. Créer l'utilisateur via Authentication → Users.

### Les styles ne s'affichent pas

✅ **Solution** : Vérifier que les 3 styles existent dans la table `styles` :
```sql
SELECT * FROM styles;
```

---

## 📞 Contact

Pour toute question ou problème, consultez :
- Le fichier `/supabase/README.md` (documentation technique complète)
- Le fichier `/supabase/migrations/001_initial_schema.sql` (schéma complet)

---

**🎯 Votre base de données ROUKI est maintenant opérationnelle !** 🚀✨
