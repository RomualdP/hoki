"use client";

import { useEffect } from "react";
import { IconUsersGroup } from "@tabler/icons-react";
import { useAuthStore } from "../../../store";
import { useTeamsApi } from "../../../features/teams/hooks";
import {
  ClubInfoWidget,
  TeamsWidget,
  InvitationsWidget,
  MatchesWidget,
  StatsWidget,
} from "../../../features/dashboard/components";

/**
 * Dashboard Coach Page
 *
 * Page principale pour les coachs après connexion
 * Affiche 5 widgets: stats, club info, équipes, matchs, invitations
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
          Bienvenue, {user?.firstName} 🏐
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
          icon={<IconUsersGroup className="w-6 h-6" />}
        />
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClubInfoWidget />
        <TeamsWidget />
        <MatchesWidget />
        <InvitationsWidget />
      </div>
    </div>
  );
}
