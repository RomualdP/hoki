import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface AuthActions {
  readonly loginUser: (user: User) => void;
  readonly logoutUser: () => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: string | null) => void;
  readonly clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        loginUser: (user: User) => {
          set(
            (state) => ({
              ...state,
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            }),
            false,
            'auth/loginUser'
          );
        },

        logoutUser: () => {
          set(
            (state) => ({
              ...state,
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            }),
            false,
            'auth/logoutUser'
          );
        },

        setLoading: (isLoading: boolean) => {
          set(
            (state) => ({
              ...state,
              isLoading,
            }),
            false,
            'auth/setLoading'
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
            'auth/setError'
          );
        },

        clearError: () => {
          set(
            (state) => ({
              ...state,
              error: null,
            }),
            false,
            'auth/clearError'
          );
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
); 