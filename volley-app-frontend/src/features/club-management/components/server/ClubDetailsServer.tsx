import { getCurrentClub } from "../../api/club.server";
import { ClubInfoCards } from "../ClubInfoCards";

/**
 * ClubDetailsServer - Server Component
 *
 * Fetch current club data server-side and display
 * No client-side JavaScript for data fetching
 *
 * Pattern: Server Component with async data fetching
 */
export async function ClubDetailsServer() {
  const club = await getCurrentClub();

  if (!club) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-900">
          Club introuvable
        </h2>
        <p className="mt-2 text-neutral-600">
          Impossible de charger les informations du club.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{club.name}</h1>
        {club.description && (
          <p className="mt-2 text-neutral-600">{club.description}</p>
        )}
      </div>

      {/* Club Information Cards */}
      <ClubInfoCards club={club} />

      {/* Development Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 Cette page est en cours de développement. D&apos;autres
          fonctionnalités seront ajoutées prochainement.
        </p>
      </div>
    </>
  );
}
