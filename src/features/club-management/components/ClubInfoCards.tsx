import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import type { Club } from "../types/club.types";

/**
 * ClubInfoCards - Dumb Component
 *
 * Display club information in cards layout
 * Props-based, no state, no effects
 *
 * Pattern: Dumb component (max 80 lines)
 */
interface ClubInfoCardsProps {
  readonly club: Club;
}

export function ClubInfoCards({ club }: ClubInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Info */}
      <DashboardCard title="Informations générales">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-neutral-200">
            <span className="text-sm font-medium text-neutral-500">
              Nom du club
            </span>
            <span className="text-sm font-semibold text-neutral-900">
              {club.name}
            </span>
          </div>
          {club.description && (
            <div className="py-2 border-b border-neutral-200">
              <span className="text-sm font-medium text-neutral-500 block mb-2">
                Description
              </span>
              <p className="text-sm text-neutral-900">{club.description}</p>
            </div>
          )}
          <div className="flex justify-between items-center py-2 border-b border-neutral-200">
            <span className="text-sm font-medium text-neutral-500">
              Date de création
            </span>
            <span className="text-sm text-neutral-900">
              {new Date(club.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </DashboardCard>

      {/* Additional Info */}
      <DashboardCard title="Propriétaire">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-neutral-200">
            <span className="text-sm font-medium text-neutral-500">
              ID Propriétaire
            </span>
            <span className="text-sm text-neutral-900 font-mono">
              {club.ownerId.substring(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-neutral-200">
            <span className="text-sm font-medium text-neutral-500">
              Dernière modification
            </span>
            <span className="text-sm text-neutral-900">
              {new Date(club.updatedAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
