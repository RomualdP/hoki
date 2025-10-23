"use client";

import { useAuthStore } from "../../../store";
import {
  ClubInfoWidget,
  TeamsWidget,
  MembersWidget,
} from "../../../features/dashboard/components";

/**
 * Dashboard Assistant Page
 *
 * Page principale pour les assistants coachs après connexion
 * Affiche 3 widgets: club info (read-only), équipes (read-only), membres
 *
 * Mobile-first, responsive grid, max 50 lignes (composition)
 */
export default function AssistantDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Bienvenue, {user?.firstName} 👋
        </h1>
        <p className="mt-2 text-neutral-600">
          Consultez les équipes et membres de votre club
        </p>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClubInfoWidget />
        <TeamsWidget />
        <div className="lg:col-span-2">
          <MembersWidget />
        </div>
      </div>
    </div>
  );
}
