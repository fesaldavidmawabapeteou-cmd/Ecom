// ============================================
// 🔌 CLIENT SUPABASE - ROUKI E-COMMERCE
// ============================================

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Configuration depuis les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Variables d\'environnement Supabase manquantes!\n' +
    'Créez un fichier .env.local avec:\n' +
    '  VITE_SUPABASE_URL=https://xxx.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  )
}

// Créer le client Supabase avec typage
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
})

// ============================================
// 🔐 HELPERS D'AUTHENTIFICATION
// ============================================

/**
 * Connexion admin avec email/password
 */
export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error('Erreur de connexion:', error)
    return { success: false, error: error.message }
  }

  return { success: true, user: data.user, session: data.session }
}

/**
 * Déconnexion admin
 */
export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Erreur de déconnexion:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Récupérer la session actuelle
 */
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Récupérer l'utilisateur actuel
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Vérifier si l'utilisateur est admin
 */
export async function isAdmin() {
  const user = await getCurrentUser()
  if (!user) return false

  // Vérifier si l'utilisateur existe dans la table admins
  const { data, error } = await supabase
    .from('admins')
    .select('is_active')
    .eq('email', user.email)
    .single()

  if (error || !data) return false
  return data.is_active
}

// ============================================
// 📦 EXPORT DEFAULT
// ============================================

export default supabase
