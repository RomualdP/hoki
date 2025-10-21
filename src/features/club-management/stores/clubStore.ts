/**
 * Club Store
 *
 * Zustand store for club state management
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Club } from "../types";

interface ClubState {
  readonly currentClub: Club | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface ClubActions {
  readonly setCurrentClub: (club: Club | null) => void;
  readonly updateCurrentClub: (updates: Partial<Club>) => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: string | null) => void;
  readonly clearError: () => void;
  readonly reset: () => void;
}

type ClubStore = ClubState & ClubActions;

const initialState: ClubState = {
  currentClub: null,
  isLoading: false,
  error: null,
};

export const useClubStore = create<ClubStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setCurrentClub: (club: Club | null) => {
          set(
            {
              currentClub: club,
              isLoading: false,
              error: null,
            },
            false,
            "club/setCurrentClub",
          );
        },

        updateCurrentClub: (updates: Partial<Club>) => {
          set(
            (state) => ({
              currentClub: state.currentClub
                ? { ...state.currentClub, ...updates }
                : null,
            }),
            false,
            "club/updateCurrentClub",
          );
        },

        setLoading: (isLoading: boolean) => {
          set({ isLoading }, false, "club/setLoading");
        },

        setError: (error: string | null) => {
          set(
            {
              error,
              isLoading: false,
            },
            false,
            "club/setError",
          );
        },

        clearError: () => {
          set({ error: null }, false, "club/clearError");
        },

        reset: () => {
          set(initialState, false, "club/reset");
        },
      }),
      {
        name: "club-storage",
        partialize: (state) => ({
          currentClub: state.currentClub,
        }),
      },
    ),
    {
      name: "club-store",
    },
  ),
);
