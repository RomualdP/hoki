"use client";

import { useEffect, ReactNode } from "react";
import { useAuthApi } from "../../features/auth/hooks";

interface AuthProviderProps {
  readonly children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { checkAuthStatus } = useAuthApi();

  useEffect(() => {
    // Vérifier le statut d'authentification au chargement de l'app
    checkAuthStatus();
  }, [checkAuthStatus]);

  return <>{children}</>;
};
