'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../components/layout';
import { Card, CardHeader, CardTitle, CardContent, LogoutButton } from '../../components/ui';
import { Input, Button } from '../../components';
import { useAuthStore } from '../../store';
import { ROUTES } from '../../constants';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Initialiser les données du profil quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      // Extraire firstName et lastName du nom complet si nécessaire
      const nameParts = user.firstName?.includes(' ') 
        ? user.firstName.split(' ')
        : [user.firstName || '', user.lastName || ''];
      
      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Note: checkAuthStatus est déjà appelé par l'AuthProvider global

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated && user === null) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, user, router]);
  
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileErrors, setProfileErrors] = useState<Partial<ProfileFormData>>({});
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordFormData>>({});

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    if (profileErrors[name as keyof ProfileFormData]) {
      setProfileErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (passwordErrors[name as keyof PasswordFormData]) {
      setPasswordErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateProfileForm = (): boolean => {
    const errors: Partial<ProfileFormData> = {};

    if (!profileData.firstName.trim()) {
      errors.firstName = 'Prénom requis';
    }

    if (!profileData.lastName.trim()) {
      errors.lastName = 'Nom requis';
    }

    if (!profileData.email.trim()) {
      errors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Format email invalide';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const errors: Partial<PasswordFormData> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Mot de passe actuel requis';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'Nouveau mot de passe requis';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateProfileForm()) return;

    // TODO: Implémenter l'appel API pour mettre à jour le profil
    // Pour l'instant, on simule juste la mise à jour locale
    if (user) {
      // Note: Ici on devrait faire un appel API pour persister les changements
      setIsEditingProfile(false);
      alert('Profil mis à jour avec succès !');
    }
  };

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validatePasswordForm()) return;

    // Simulate password change
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  // Affichage de chargement
  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 font-heading">
              Chargement...
            </h1>
            <p className="mt-2 text-gray-600">
              Chargement de votre profil...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-heading">
          Mon Profil
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <Input
                  id="firstName"
                  name="firstName"
                  label="Prénom"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  required
                  disabled={!isEditingProfile}
                  error={profileErrors.firstName}
                />

                <Input
                  id="lastName"
                  name="lastName"
                  label="Nom"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  required
                  disabled={!isEditingProfile}
                  error={profileErrors.lastName}
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  disabled={!isEditingProfile}
                  error={profileErrors.email}
                />

                <div className="flex gap-2">
                  {!isEditingProfile ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      Modifier
                    </Button>
                  ) : (
                    <>
                      <Button type="submit" variant="primary">
                        Sauvegarder
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileData({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                          });
                          setProfileErrors({});
                        }}
                      >
                        Annuler
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle>Changer le Mot de Passe</CardTitle>
            </CardHeader>
            <CardContent>
              {!isChangingPassword ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">
                    Modifiez votre mot de passe pour sécuriser votre compte.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Changer le mot de passe
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    label="Mot de passe actuel"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    error={passwordErrors.currentPassword}
                  />

                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    label="Nouveau mot de passe"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    error={passwordErrors.newPassword}
                  />

                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirmer le nouveau mot de passe"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    error={passwordErrors.confirmPassword}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" variant="primary">
                      Changer
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                        setPasswordErrors({});
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Actions du Compte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Déconnexion
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Déconnectez-vous de votre session actuelle. Vous devrez vous reconnecter pour accéder à votre compte.
                  </p>
                </div>
                <LogoutButton 
                  variant="danger"
                  className="shrink-0"
                >
                  Se déconnecter
                </LogoutButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 