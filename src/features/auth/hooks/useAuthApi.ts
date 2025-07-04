import { useCallback } from 'react';
import { useApi } from '../../../hooks/useApi';
import { useAuthStore } from '../../../store';
import type { User } from '../../../types';

interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

interface RegisterData {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}

export const useAuthApi = () => {
  const authApi = useApi<User>();
  const loginApi = useApi<{ user: User; accessToken: string }>();
  const registerApi = useApi<{ user: User; accessToken: string }>();
  const store = useAuthStore();

  const login = useCallback(async (credentials: LoginCredentials) => {
    store.setLoading(true);
    
    try {
      const response = await loginApi.post('/auth/login', credentials);
      if (response) {
        // Adapter les données utilisateur du backend vers le format frontend
        const userWithDefaults = {
          ...response.user,
          role: 'USER' as const,
          isActive: true,
          lastName: response.user.lastName || '',
        };
        
        store.loginUser(userWithDefaults);
        localStorage.setItem('access_token', response.accessToken);
        return response;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la connexion';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = useCallback(async (registerData: RegisterData) => {
    store.setLoading(true);
    
    try {
      const response = await registerApi.post('/auth/register', registerData);
      if (response) {
        // Adapter les données utilisateur du backend vers le format frontend
        const userWithDefaults = {
          ...response.user,
          role: 'USER' as const,
          isActive: true,
          lastName: response.user.lastName || '',
        };
        
        store.loginUser(userWithDefaults);
        localStorage.setItem('access_token', response.accessToken);
        return response;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'inscription';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(async () => {
    store.setLoading(true);
    
    try {
      try {
        await authApi.post('/auth/logout');
      } catch (apiError) {
        console.warn('Logout API call failed, continuing with client-side logout:', apiError);
      }

      localStorage.removeItem('access_token');
      store.logoutUser();
      
      return true;
    } catch (error) {
      localStorage.removeItem('access_token');
      store.logoutUser();
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la déconnexion';
      console.error('Logout error:', errorMessage);
      
      return false;
    } finally {
      store.setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      store.logoutUser();
      return;
    }

    if (store.isAuthenticated && store.user) {
      return;
    }

    store.setLoading(true);
    
    try {
      const user = await authApi.get('/auth/profile');
      if (user) {
        // Adapter les données utilisateur du backend vers le format frontend
        const userWithDefaults = {
          ...user,
          role: 'USER' as const,
          isActive: true,
          lastName: user.lastName || '',
        };
        
        store.loginUser(userWithDefaults);
      } else {
        localStorage.removeItem('access_token');
        store.logoutUser();
      }
    } catch {
      localStorage.removeItem('access_token');
      store.logoutUser();
    } finally {
      store.setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // Store state
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading || loginApi.isLoading || registerApi.isLoading || authApi.isLoading,
    error: store.error || loginApi.error || registerApi.error || authApi.error,
    
    // Store actions
    clearError: store.clearError,
    
    // API actions
    login,
    register,
    logout,
    checkAuthStatus,
  };
}; 