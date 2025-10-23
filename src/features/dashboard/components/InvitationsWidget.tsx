"use client";

import { useAuthStore } from "../../../store";
import { InvitationLinkGenerator } from "../../club-management/components/invitations/InvitationLinkGenerator";
import { DashboardCard } from "./DashboardCard";

/**
 * InvitationsWidget - Smart Component
 *
 * Wrapper autour du composant InvitationLinkGenerator existant
 * Permet de générer des liens d'invitation pour joueurs et assistants
 *
 * Max 100 lignes (smart component)
 */
export function InvitationsWidget() {
  const { clubId } = useAuthStore();

  if (!clubId) {
    return (
      <DashboardCard title="Invitations">
        <p className="text-neutral-500 text-sm">Aucun club associé</p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Invitations">
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          Générez des liens d&apos;invitation pour ajouter des joueurs ou des
          assistants à votre club.
        </p>
        <InvitationLinkGenerator clubId={clubId} />
      </div>
    </DashboardCard>
  );
}
