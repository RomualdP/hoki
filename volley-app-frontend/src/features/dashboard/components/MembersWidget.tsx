"use client";

import { useAuthStore } from "../../../store";
import { MembersList } from "../../club-management/components/members/MembersList";
import { DashboardCard } from "./DashboardCard";

/**
 * MembersWidget - Smart Component
 *
 * Affiche la liste des membres du club (read-only pour assistant)
 * Réutilise le composant MembersList existant
 *
 * Max 100 lignes (smart component)
 */
export function MembersWidget() {
  const { clubId } = useAuthStore();

  if (!clubId) {
    return (
      <DashboardCard title="Membres du Club">
        <p className="text-neutral-500 text-sm">Aucun club associé</p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Membres du Club">
      <MembersList clubId={clubId} />
    </DashboardCard>
  );
}
