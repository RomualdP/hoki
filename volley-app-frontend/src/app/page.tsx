"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store";
import { ROUTES } from "../constants";

/**
 * Page d'accueil
 *
 * Redirige automatiquement vers le dashboard approprié selon le rôle
 * ou vers /login si non authentifié
 */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, clubRole, role } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    if (clubRole === "OWNER") {
      router.push(ROUTES.DASHBOARD.COACH);
    } else if (clubRole === "COACH") {
      router.push(ROUTES.DASHBOARD.ASSISTANT);
    } else if (clubRole === "PLAYER") {
      router.push(ROUTES.DASHBOARD.PLAYER);
    } else if (role === "ADMIN") {
      router.push(ROUTES.ADMIN.BASE);
    } else {
      router.push(ROUTES.DASHBOARD.PLAYER);
    }
  }, [isAuthenticated, clubRole, role, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
        <p className="mt-4 text-neutral-600">Chargement...</p>
      </div>
    </div>
  );
}
