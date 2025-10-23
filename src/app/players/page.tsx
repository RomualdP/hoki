"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "../../store";
import { useUsersApi } from "../../features/users/hooks/useUsersApi";
import { Button } from "../../shared/components";
import { Input } from "../../components/forms";
import type { User } from "../../types";

export default function PlayersPage() {
  const { clubId } = useAuthStore();
  const { users, fetchUsers, isLoading } = useUsersApi();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter users by clubId to show only players from the coach's club
  const clubPlayers = useMemo(() => {
    return users.filter((user) => user.clubId === clubId);
  }, [users, clubId]);

  // Filter by search term
  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) {
      return clubPlayers;
    }

    return clubPlayers.filter((player) => {
      const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
      const email = player.email.toLowerCase();
      const search = searchTerm.toLowerCase();

      return fullName.includes(search) || email.includes(search);
    });
  }, [clubPlayers, searchTerm]);

  const getRoleBadge = (role?: string | null) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (role) {
      case "COACH":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case "ASSISTANT_COACH":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "PLAYER":
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRoleLabel = (role?: string | null) => {
    switch (role) {
      case "COACH":
        return "Coach";
      case "ASSISTANT_COACH":
        return "Assistant";
      case "PLAYER":
        return "Joueur";
      default:
        return "Membre";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-heading">
            Mes joueurs
          </h1>
          <p className="mt-2 text-neutral-600">
            Gérez et consultez tous les membres de votre club
          </p>
        </div>
        <Button>Inviter un joueur</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">
                Total membres
              </p>
              <p className="text-2xl font-bold text-neutral-900">
                {clubPlayers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm14 10.5V9c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v7h2v6h4v-6h2v-1.5zm-8 0V9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v7h2v6h4v-6h2v-1.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Joueurs</p>
              <p className="text-2xl font-bold text-neutral-900">
                {
                  clubPlayers.filter((player) => player.clubRole === "PLAYER")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Staff</p>
              <p className="text-2xl font-bold text-neutral-900">
                {
                  clubPlayers.filter(
                    (player) =>
                      player.clubRole === "COACH" ||
                      player.clubRole === "ASSISTANT_COACH",
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              id="search-players"
              name="search"
              type="text"
              label="Recherche"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Effacer
            </Button>
          </div>
        </div>
        {searchTerm && (
          <p className="text-sm text-neutral-600 mt-2">
            {filteredPlayers.length} résultat(s) trouvé(s) pour &quot;
            {searchTerm}&quot;
          </p>
        )}
      </div>

      {/* Players Grid */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">
            Membres du club ({filteredPlayers.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">Chargement des joueurs...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">
              {searchTerm
                ? "Aucun joueur trouvé"
                : "Aucun membre dans votre club"}
            </p>
            {!searchTerm && (
              <Button className="mt-4">Inviter le premier membre</Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface PlayerCardProps {
  readonly player: User;
}

function PlayerCard({ player }: PlayerCardProps) {
  const getRoleBadge = (role?: string | null) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (role) {
      case "COACH":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case "ASSISTANT_COACH":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "PLAYER":
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRoleLabel = (role?: string | null) => {
    switch (role) {
      case "COACH":
        return "Coach";
      case "ASSISTANT_COACH":
        return "Assistant";
      case "PLAYER":
        return "Joueur";
      default:
        return "Membre";
    }
  };

  return (
    <div className="px-6 py-4 hover:bg-neutral-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-lg font-medium text-orange-800">
              {player.firstName.charAt(0)}
              {player.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-base font-medium text-neutral-900">
              {player.firstName} {player.lastName}
            </h3>
            <p className="text-sm text-neutral-500">{player.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={getRoleBadge(player.clubRole)}>
            {getRoleLabel(player.clubRole)}
          </span>
          <Button variant="ghost" size="sm">
            Voir profil
          </Button>
        </div>
      </div>
    </div>
  );
}
