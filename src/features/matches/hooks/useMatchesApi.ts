import { useCallback } from 'react';
import { useApi } from '../../../shared/hooks/useApi';
import { useMatchesStore } from '../../../store';
import type { Match } from '../../../types';

export const useMatchesApi = () => {
  const matchesApi = useApi<Match[]>();
  const matchApi = useApi<Match>();
  const store = useMatchesStore();

  const fetchMatches = useCallback(async () => {
    store.setLoading(true);
    
    try {
      const matches = await matchesApi.get('/matches');
      if (matches) {
        store.setMatches(matches);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des matchs';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createMatch = useCallback(async (matchData: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>) => {
    store.setLoading(true);
    
    try {
      const newMatch = await matchApi.post('/matches', matchData);
      if (newMatch) {
        store.addMatch(newMatch);
        return newMatch;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création du match';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateMatch = useCallback(async (matchId: string, updates: Partial<Match>) => {
    store.setLoading(true);
    
    try {
      const updatedMatch = await matchApi.put(`/matches/${matchId}`, updates);
      if (updatedMatch) {
        store.updateMatch(matchId, updatedMatch);
        return updatedMatch;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du match';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteMatch = useCallback(async (matchId: string) => {
    store.setLoading(true);
    
    try {
      const success = await matchApi.delete(`/matches/${matchId}`);
      if (success) {
        store.deleteMatch(matchId);
        return true;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression du match';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return false;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // Store state
    matches: store.matches,
    selectedMatch: store.selectedMatch,
    isLoading: store.isLoading || matchesApi.isLoading || matchApi.isLoading,
    error: store.error || matchesApi.error || matchApi.error,
    
    // Store actions
    selectMatch: store.selectMatch,
    clearError: store.clearError,
    
    // API actions
    fetchMatches,
    createMatch,
    updateMatch,
    deleteMatch,
  };
}; 