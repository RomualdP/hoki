"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../store";
import { useClub } from "../../features/club-management/hooks/useClub";
import { DashboardCard } from "../../features/dashboard/components/DashboardCard";

/**
 * Club Page
 *
 * Page détaillée du club avec toutes les informations
 * Accessible à tous les membres du club (COACH, ASSISTANT_COACH, PLAYER)
 */
export default function ClubPage() {
  const { clubId } = useAuthStore();
  const { currentClub, isLoading, fetchClub } = useClub();

  useEffect(() => {
    if (clubId) {
      fetchClub(clubId);
    }
  }, [clubId, fetchClub]);

  if (!clubId) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900">
              Aucun club associé
            </h1>
            <p className="mt-2 text-neutral-600">
              Vous devez être membre d&apos;un club pour accéder à cette page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
            <p className="mt-4 text-neutral-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentClub) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900">
              Club introuvable
            </h1>
            <p className="mt-2 text-neutral-600">
              Impossible de charger les informations du club.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            {currentClub.name}
          </h1>
          {currentClub.description && (
            <p className="mt-2 text-neutral-600">{currentClub.description}</p>
          )}
        </div>

        {/* Club Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <DashboardCard title="Informations générales">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                <span className="text-sm font-medium text-neutral-500">
                  Nom du club
                </span>
                <span className="text-sm font-semibold text-neutral-900">
                  {currentClub.name}
                </span>
              </div>
              {currentClub.description && (
                <div className="py-2 border-b border-neutral-200">
                  <span className="text-sm font-medium text-neutral-500 block mb-2">
                    Description
                  </span>
                  <p className="text-sm text-neutral-900">
                    {currentClub.description}
                  </p>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                <span className="text-sm font-medium text-neutral-500">
                  Date de création
                </span>
                <span className="text-sm text-neutral-900">
                  {new Date(currentClub.createdAt).toLocaleDateString("fr-FR")}
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
                  {currentClub.ownerId.substring(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                <span className="text-sm font-medium text-neutral-500">
                  Dernière modification
                </span>
                <span className="text-sm text-neutral-900">
                  {new Date(currentClub.updatedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Additional sections could be added here */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Cette page est en cours de développement. D&apos;autres
            fonctionnalités seront ajoutées prochainement.
          </p>
        </div>
      </div>
    </div>
  );
}
