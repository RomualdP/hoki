import { getCurrentClub } from "@/features/club-management/api/club.server";
import { InvitationLinkGenerator } from "@/features/club-management/components/invitations/InvitationLinkGenerator";
import { DashboardCard } from "../DashboardCard";

/**
 * InvitationsWidgetServer - Server Component
 *
 * Wrapper around InvitationLinkGenerator
 * Fetches club ID server-side, passes to client component
 *
 * Pattern: Server Component wrapper → Client Component for interactivity
 */
export async function InvitationsWidgetServer() {
  const club = await getCurrentClub();

  if (!club) {
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
        <InvitationLinkGenerator clubId={club.id} />
      </div>
    </DashboardCard>
  );
}
