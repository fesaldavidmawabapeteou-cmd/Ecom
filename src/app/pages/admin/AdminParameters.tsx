import React, { useState } from 'react';
import { Lock, RotateCcw, LogOut } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../hooks/useApi';
import { toast } from 'sonner';

export const AdminParameters = () => {
  const navigate = useNavigate();
  const { logout } = useStore();
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resetConfirm, setResetConfirm] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoadingPassword(true);
    try {
      // Call API to change password
      await api.changeAdminPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      toast.success('Mot de passe modifié avec succès');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la modification du mot de passe');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleResetStore = async () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }

    setLoadingReset(true);
    try {
      await api.resetStore();
      toast.success('Boutique réinitialisée avec succès');
      setResetConfirm(false);
      // Refresh the page to see changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoadingReset(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl mb-6 md:mb-8">Paramètres</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Password Section */}
        <div className="glass-card rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold">Modifier le mot de passe</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                placeholder="Entrez votre mot de passe actuel"
                className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                placeholder="Entrez votre nouveau mot de passe"
                className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                placeholder="Confirmez votre nouveau mot de passe"
                className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loadingPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {loadingPassword ? 'Modification en cours...' : 'Modifier le mot de passe'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="glass-card rounded-2xl p-4 md:p-6 border-red-200 bg-red-50/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <RotateCcw className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-red-700">Zone dangereuse</h2>
          </div>

          <div>
            <h3 className="font-medium text-red-900 mb-2">Réinitialiser la boutique</h3>
            <p className="text-sm text-red-800 mb-4">
              Cette action supprimera tous les produits, commandes et données de la boutique. Cette action est irréversible.
            </p>

            {resetConfirm ? (
              <div className="bg-red-100 border border-red-300 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <p className="font-medium text-red-900">Êtes-vous absolument sûr?</p>
                    <p className="text-sm text-red-800 mt-1">
                      Cette action ne peut pas être annulée. Toutes les données seront perdues.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetStore}
                    disabled={loadingReset}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    {loadingReset ? 'Réinitialisation...' : 'Confirmer'}
                  </button>
                  <button
                    onClick={() => setResetConfirm(false)}
                    disabled={loadingReset}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleResetStore}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Réinitialiser la boutique
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Logout Section - Desktop */}
      <div className="hidden md:block mt-8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Logout Section - Mobile */}
      <div className="md:hidden mt-8 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};
