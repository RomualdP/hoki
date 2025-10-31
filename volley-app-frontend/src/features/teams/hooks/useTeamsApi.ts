import { useCallback } from 'react';
import { useApi } from '../../../shared/hooks/useApi';
import { useTeamsStore } from '../../../shared/store';
import type { Team } from '../../../shared/types';

export const useTeamsApi = () => {
  const teamsApi = useApi<Team[]>();
  const teamApi = useApi<Team>();
  const store = useTeamsStore();

  const fetchTeams = useCallback(async () => {
    store.setLoading(true);
    
    try {
      const teams = await teamsApi.get('/teams');
      if (teams) {
        store.setTeams(teams);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des équipes';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createTeam = useCallback(async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
    store.setLoading(true);
    
    try {
      const newTeam = await teamApi.post('/teams', teamData);
      if (newTeam) {
        store.addTeam(newTeam);
        return newTeam;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de l\'équipe';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateTeam = useCallback(async (teamId: string, updates: Partial<Team>) => {
    store.setLoading(true);
    
    try {
      const updatedTeam = await teamApi.put(`/teams/${teamId}`, updates);
      if (updatedTeam) {
        store.updateTeam(teamId, updatedTeam);
        return updatedTeam;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'équipe';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteTeam = useCallback(async (teamId: string) => {
    store.setLoading(true);
    
    try {
      const success = await teamApi.delete(`/teams/${teamId}`);
      if (success) {
        store.deleteTeam(teamId);
        return true;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'équipe';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return false;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // Store state
    teams: store.teams,
    selectedTeam: store.selectedTeam,
    isLoading: store.isLoading || teamsApi.isLoading || teamApi.isLoading,
    error: store.error || teamsApi.error || teamApi.error,
    
    // Store actions
    selectTeam: store.selectTeam,
    clearError: store.clearError,
    
    // API actions
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
  };
}; 