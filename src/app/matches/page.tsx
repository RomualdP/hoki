"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, Button } from "../../components/ui";
import { Input, Select } from "../../components/forms";
import { useMatchesApi } from "../../features/matches/hooks/useMatchesApi";
import { useAuthStore } from "../../store";
import { formatDate } from "../../utils";
import type { Match, MatchStatus } from "../../types";

const MATCH_STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "SCHEDULED", label: "Programmé" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "COMPLETED", label: "Terminé" },
  { value: "CANCELLED", label: "Annulé" },
];

export default function MatchesPage() {
  const { matches, fetchMatches, isLoading } = useMatchesApi();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchMatches();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      searchQuery === "" ||
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (match.location &&
        match.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatusFilter = !statusFilter || match.status === statusFilter;

    return matchesSearch && matchesStatusFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0 font-heading">
          Liste des Matchs
        </h1>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowAddForm(true)}>
            Ajouter un match
          </Button>
        )}
      </div>

      {/* Add Match Form for Admins */}
      {showAddForm && isAdmin && (
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Nouveau match</h2>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
            </div>
            <p className="text-gray-600 text-sm">
              Fonctionnalité d&apos;ajout de match à implémenter...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              id="search"
              name="search"
              label="Rechercher"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Équipe, lieu..."
            />

            <Select
              id="status"
              name="status"
              label="Statut"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={MATCH_STATUS_OPTIONS}
            />

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                }}
                className="w-full"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matches List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">Chargement des matchs...</p>
            </CardContent>
          </Card>
        ) : filteredMatches.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">
                Aucun match trouvé avec ces critères.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </div>
    </div>
  );
}

interface MatchCardProps {
  readonly match: Match;
}

function MatchCard({ match }: MatchCardProps) {
  const getStatusColor = (status: MatchStatus): string => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: MatchStatus): string => {
    switch (status) {
      case "SCHEDULED":
        return "Programmé";
      case "IN_PROGRESS":
        return "En cours";
      case "COMPLETED":
        return "Terminé";
      case "CANCELLED":
        return "Annulé";
      default:
        return status;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}
              >
                {getStatusLabel(match.status)}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(match.scheduledAt)}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="text-right">
                <h3 className="font-medium text-gray-900">
                  {match.homeTeam.name}
                </h3>
              </div>

              <div className="text-center">
                {match.status === "COMPLETED" &&
                match.homeScore !== undefined &&
                match.awayScore !== undefined ? (
                  <span className="text-2xl font-bold text-gray-900">
                    {match.homeScore} - {match.awayScore}
                  </span>
                ) : (
                  <span className="text-lg font-medium text-gray-500">vs</span>
                )}
              </div>

              <div className="text-left">
                <h3 className="font-medium text-gray-900">
                  {match.awayTeam.name}
                </h3>
              </div>
            </div>

            {match.location && (
              <p className="text-sm text-gray-600 text-center">
                📍 {match.location}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/matches/${match.id}`}>
              <Button variant="outline" size="sm">
                Détails
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
