# Configuration Resend pour l'envoi d'emails

## 📋 Status
✅ Code intégré dans `supabase/functions/server/index.tsx`  
⏳ **À faire:** Configurer les secrets dans Supabase

## 🔧 Étapes de Configuration

### 1. Installer Supabase CLI (si pas déjà fait)
```bash
npm install -g supabase
# ou
npx supabase
```

### 2. Configurer les secrets
Choisissez une des deux méthodes :

#### **Option A: Via CLI (recommandé)**
```bash
supabase secrets set RESEND_API_KEY=re_UV1H7zNH_4Avod9BteyiFHqqFBCqMxF5R
supabase secrets set EMAIL_FROM_DOMAIN=noreply@roukii.com
```

#### **Option B: Via Dashboard Supabase**
1. Aller sur [https://app.supabase.com/](https://app.supabase.com/)
2. Sélectionner le projet
3. Aller dans **Settings** → **Functions** → **Secrets**
4. Ajouter :
   - Clé: `RESEND_API_KEY`
   - Valeur: `re_UV1H7zNH_4Avod9BteyiFHqqFBCqMxF5R`
   - Clé: `EMAIL_FROM_DOMAIN` (optionnel)
   - Valeur: `noreply@roukii.com`

### 3. Déployer la fonction misà jour
```bash
supabase functions deploy server
```

## ✉️ Comportement

Une fois configuré, **à chaque création de commande** :
- Un email HTML formaté sera envoyé à `admin@roukii.com`
- Le log sera sauvegardé dans le KV store sous `email_logs:{order_id}`
- Les emails manqués (sans RESEND_API_KEY) restent en status `PENDING`

## 📧 Exemple d'email reçu

- **De:** noreply@roukii.com
- **À:** admin@roukii.com
- **Objet:** Nouvelle commande ORD-1739716234567 - ROUKI
- **Contenu:** Tableau formaté avec produits, tailles, quantités, prix totaux

## 🔍 Vérification

Pour vérifier que tout est configuré, consultez :
- Les logs Supabase: `supabase functions list`
- Les logs d'emails KV: Route `/email_logs` (à implémenter si nécessaire)

## 📝 Notes

- La clé API fournie commence par `re_`, ce qui confirme que c'est une clé Resend valide
- Le domaine DNs doit être configuré sur Resend pour que les emails passent les contrôles SPF/DKIM
- La fonction gère les erreurs gracieusement et les enregistre en log

---

**Prêt ?** Exécutez l'Option A ou B ci-dessus pour finaliser la configuration.
