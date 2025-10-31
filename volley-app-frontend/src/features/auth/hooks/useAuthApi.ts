import { useCallback } from "react";
import { useApi } from "../../../hooks/useApi";
import { useAuthStore } from "../../../store";
import type { User } from "../../../types";

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
  const loginApi = useApi<{ user: User }>();
  const registerApi = useApi<{ user: User }>();
  const store = useAuthStore();

  const login = useCallback(async (credentials: LoginCredentials) => {
    store.setLoading(true);

    try {
      const response = await loginApi.post("/auth/login", credentials);

      if (response) {
        const userWithDefaults = {
          ...response.user,
          role: "USER" as const,
          isActive: true,
          lastName: response.user.lastName || "",
        };

        store.loginUser(userWithDefaults);
        return response;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors de la connexion";
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
      const response = await registerApi.post("/auth/register", registerData);
      if (response) {
        const userWithDefaults = {
          ...response.user,
          role: "USER" as const,
          isActive: true,
          lastName: response.user.lastName || "",
        };

        store.loginUser(userWithDefaults);
        return response;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors de l'inscription";
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
      // Call backend to clear httpOnly cookie
      await authApi.post("/auth/logout");
      store.logoutUser();
      return true;
    } catch {
      // Even if API call fails, logout client-side
      store.logoutUser();
      return false;
    } finally {
      store.setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = useCallback(async () => {
    // If already authenticated with user data, skip check
    if (store.isAuthenticated && store.user) {
      return;
    }

    store.setLoading(true);

    try {
      // Try to get user profile with httpOnly cookie
      const user = await authApi.get("/auth/profile");
      if (user) {
        // Adapter les données utilisateur du backend vers le format frontend
        const userWithDefaults = {
          ...user,
          role: "USER" as const,
          isActive: true,
          lastName: user.lastName || "",
        };

        store.loginUser(userWithDefaults);
      } else {
        store.logoutUser();
      }
    } catch {
      // If profile fetch fails, user is not authenticated
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
    isLoading:
      store.isLoading ||
      loginApi.isLoading ||
      registerApi.isLoading ||
      authApi.isLoading,
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
