'use client';

import { useEffect } from 'react';
import { Layout, Button } from '../../shared/components';
import { TeamCard } from '../../features/teams/components';
import { useTeamsApi } from '../../features/teams/hooks/useTeamsApi';
import type { Team } from '../../shared/types';

export default function TeamsPage() {
  const { teams, fetchTeams, selectTeam, isLoading } = useTeamsApi();

  useEffect(() => {
    fetchTeams();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTeamSelect = (team: Team) => {
    selectTeam(team);
    // TODO: Navigation vers la page de détail de l'équipe
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Équipes</h1>
            <p className="mt-2 text-neutral-600">
              Gérez et consultez toutes vos équipes de volleyball
            </p>
          </div>
          <Button>
            Créer une équipe
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm14 10.5V9c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v7h2v6h4v-6h2v-1.5zm-8 0V9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v7h2v6h4v-6h2v-1.5z"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total équipes</p>
                <p className="text-2xl font-bold text-neutral-900">{teams.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total joueurs</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {teams.reduce((total, team) => total + team.members.length, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Équipes actives</p>
                <p className="text-2xl font-bold text-neutral-900">{teams.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-500">Chargement des équipes...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-500">Aucune équipe disponible</p>
              <Button className="mt-4">
                Créer la première équipe
              </Button>
            </div>
          ) : (
            teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onSelect={handleTeamSelect}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
} 