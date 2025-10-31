import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Team } from '../types';

interface TeamsState {
  readonly teams: Team[];
  readonly selectedTeam: Team | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface TeamsActions {
  readonly setTeams: (teams: Team[]) => void;
  readonly addTeam: (team: Team) => void;
  readonly updateTeam: (teamId: string, updates: Partial<Team>) => void;
  readonly deleteTeam: (teamId: string) => void;
  readonly selectTeam: (team: Team | null) => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: string | null) => void;
  readonly clearError: () => void;
}

type TeamsStore = TeamsState & TeamsActions;

const initialState: TeamsState = {
  teams: [],
  selectedTeam: null,
  isLoading: false,
  error: null,
};

export const useTeamsStore = create<TeamsStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setTeams: (teams: Team[]) => {
        set(
          (state) => ({
            ...state,
            teams,
            isLoading: false,
            error: null,
          }),
          false,
          'teams/setTeams'
        );
      },

      addTeam: (team: Team) => {
        set(
          (state) => ({
            ...state,
            teams: [...state.teams, team],
          }),
          false,
          'teams/addTeam'
        );
      },

      updateTeam: (teamId: string, updates: Partial<Team>) => {
        set(
          (state) => ({
            ...state,
            teams: state.teams.map((team) =>
              team.id === teamId ? { ...team, ...updates } : team
            ),
            selectedTeam:
              state.selectedTeam?.id === teamId
                ? { ...state.selectedTeam, ...updates }
                : state.selectedTeam,
          }),
          false,
          'teams/updateTeam'
        );
      },

      deleteTeam: (teamId: string) => {
        set(
          (state) => ({
            ...state,
            teams: state.teams.filter((team) => team.id !== teamId),
            selectedTeam:
              state.selectedTeam?.id === teamId ? null : state.selectedTeam,
          }),
          false,
          'teams/deleteTeam'
        );
      },

      selectTeam: (team: Team | null) => {
        set(
          (state) => ({
            ...state,
            selectedTeam: team,
          }),
          false,
          'teams/selectTeam'
        );
      },

      setLoading: (isLoading: boolean) => {
        set(
          (state) => ({
            ...state,
            isLoading,
          }),
          false,
          'teams/setLoading'
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
          'teams/setError'
        );
      },

      clearError: () => {
        set(
          (state) => ({
            ...state,
            error: null,
          }),
          false,
          'teams/clearError'
        );
      },
    }),
    {
      name: 'teams-store',
    }
  )
); 