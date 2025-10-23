"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../../store";
import { useTeamsApi } from "../../../features/teams/hooks";
import {
  ClubInfoWidget,
  SubscriptionWidget,
  TeamsWidget,
  InvitationsWidget,
  StatsWidget,
} from "../../../features/dashboard/components";

/**
 * Dashboard Coach Page
 *
 * Page principale pour les coachs après connexion
 * Affiche 5 widgets: stats, club info, abonnement, équipes, invitations
 *
 * Mobile-first, responsive grid, max 50 lignes (composition)
 */
export default function CoachDashboardPage() {
  const { user } = useAuthStore();
  const { teams, fetchTeams } = useTeamsApi();

  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Bienvenue, {user?.firstName} 👋
        </h1>
        <p className="mt-2 text-neutral-600">
          Gérez votre club et vos équipes depuis votre dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsWidget
          label="Total équipes"
          value={teams.length}
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm14 10.5V9c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v7h2v6h4v-6h2v-1.5zm-8 0V9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v7h2v6h4v-6h2v-1.5z" />
            </svg>
          }
        />
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClubInfoWidget />
        <TeamsWidget />
        <InvitationsWidget />
        <SubscriptionWidget />
      </div>
    </div>
  );
}
