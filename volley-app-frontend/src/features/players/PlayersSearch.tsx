"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/forms";
import { Button } from "@/shared/components";
import type { User } from "@/types";
import { PlayerCard } from "./PlayerCard";

/**
 * PlayersSearch - Client Component
 *
 * Handles client-side search filtering of players
 * Uses controlled input state and useMemo for filtering
 */

interface PlayersSearchProps {
  readonly players: User[];
}

export function PlayersSearch({ players }: PlayersSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter players by search term
  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) {
      return players;
    }

    return players.filter((player) => {
      const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
      const email = player.email.toLowerCase();
      const search = searchTerm.toLowerCase();

      return fullName.includes(search) || email.includes(search);
    });
  }, [players, searchTerm]);

  return (
    <>
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

      {/* Players List */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">
            Membres du club ({filteredPlayers.length})
          </h2>
        </div>

        {filteredPlayers.length === 0 ? (
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
    </>
  );
}
