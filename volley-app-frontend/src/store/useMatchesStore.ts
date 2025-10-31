import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Match, MatchFilters } from '../types';

interface MatchesState {
  readonly matches: Match[];
  readonly selectedMatch: Match | null;
  readonly filters: MatchFilters;
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface MatchesActions {
  readonly setMatches: (matches: Match[]) => void;
  readonly addMatch: (match: Match) => void;
  readonly updateMatch: (matchId: string, updates: Partial<Match>) => void;
  readonly deleteMatch: (matchId: string) => void;
  readonly selectMatch: (match: Match | null) => void;
  readonly setFilters: (filters: Partial<MatchFilters>) => void;
  readonly clearFilters: () => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: string | null) => void;
  readonly clearError: () => void;
}

type MatchesStore = MatchesState & MatchesActions;

const initialState: MatchesState = {
  matches: [],
  selectedMatch: null,
  filters: {},
  isLoading: false,
  error: null,
};

export const useMatchesStore = create<MatchesStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setMatches: (matches: Match[]) => {
        set(
          (state) => ({
            ...state,
            matches,
            isLoading: false,
            error: null,
          }),
          false,
          'matches/setMatches'
        );
      },

      addMatch: (match: Match) => {
        set(
          (state) => ({
            ...state,
            matches: [...state.matches, match],
          }),
          false,
          'matches/addMatch'
        );
      },

      updateMatch: (matchId: string, updates: Partial<Match>) => {
        set(
          (state) => ({
            ...state,
            matches: state.matches.map((match) =>
              match.id === matchId ? { ...match, ...updates } : match
            ),
            selectedMatch:
              state.selectedMatch?.id === matchId
                ? { ...state.selectedMatch, ...updates }
                : state.selectedMatch,
          }),
          false,
          'matches/updateMatch'
        );
      },

      deleteMatch: (matchId: string) => {
        set(
          (state) => ({
            ...state,
            matches: state.matches.filter((match) => match.id !== matchId),
            selectedMatch:
              state.selectedMatch?.id === matchId ? null : state.selectedMatch,
          }),
          false,
          'matches/deleteMatch'
        );
      },

      selectMatch: (match: Match | null) => {
        set(
          (state) => ({
            ...state,
            selectedMatch: match,
          }),
          false,
          'matches/selectMatch'
        );
      },

      setFilters: (filters: Partial<MatchFilters>) => {
        set(
          (state) => ({
            ...state,
            filters: { ...state.filters, ...filters },
          }),
          false,
          'matches/setFilters'
        );
      },

      clearFilters: () => {
        set(
          (state) => ({
            ...state,
            filters: {},
          }),
          false,
          'matches/clearFilters'
        );
      },

      setLoading: (isLoading: boolean) => {
        set(
          (state) => ({
            ...state,
            isLoading,
          }),
          false,
          'matches/setLoading'
        );
      },

      setError: (error: string | null) => {
        set(
          (state) => ({
            ...state,
            error,
            isLoading: false,
          }),
          false,
          'matches/setError'
        );
      },

      clearError: () => {
        set(
          (state) => ({
            ...state,
            error: null,
          }),
          false,
          'matches/clearError'
        );
      },
    }),
    {
      name: 'matches-store',
    }
  )
); 