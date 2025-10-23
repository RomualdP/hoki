"use client";

import { useAuthStore } from "../../../store";
import {
  ClubInfoWidget,
  MyTeamsWidget,
} from "../../../features/dashboard/components";

/**
 * Dashboard Player Page
 *
 * Page principale pour les joueurs après connexion
 * Affiche 2 widgets: club info (read-only), mes équipes
 *
 * Mobile-first, responsive grid, max 50 lignes (composition)
 */
export default function PlayerDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Bienvenue, {user?.firstName} 🏐
        </h1>
        <p className="mt-2 text-neutral-600">
          Consultez vos équipes et les informations de votre club
        </p>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClubInfoWidget />
        <MyTeamsWidget />
      </div>
    </div>
  );
}
