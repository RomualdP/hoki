'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '../../components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui';
import { Input, Button } from '../../components';
import { useAuthApi } from '../../features/auth/hooks/useAuthApi';
import { ROUTES } from '../../constants';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthApi();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prénom requis';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nom requis';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une majuscule et une minuscule';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation du mot de passe requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear API error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });

      if (response) {
        router.push(ROUTES.MATCHES);
      }
    } catch (error) {
      // Error is handled by the useAuthApi hook
      console.error('Registration failed:', error);
    }
  };

  return (
    <Layout showNavigation={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 font-heading">
              Inscription
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Créez votre compte VolleyApp
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Créer un compte</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="firstName"
                    name="firstName"
                    label="Prénom"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
                    error={errors.firstName}
                    disabled={isLoading}
                  />

                  <Input
                    id="lastName"
                    name="lastName"
                    label="Nom"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    required
                    error={errors.lastName}
                    disabled={isLoading}
                  />
                </div>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Adresse email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  required
                  error={errors.email}
                  disabled={isLoading}
                />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Mot de passe"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  error={errors.password}
                  disabled={isLoading}
                />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  error={errors.confirmPassword}
                  disabled={isLoading}
                />

                {(errors.general || error) && (
                  <div className="text-sm text-red-600 text-center">
                    {errors.general || error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Création du compte...' : 'Créer mon compte'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?{' '}
                  <Link
                    href={ROUTES.LOGIN}
                    className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 