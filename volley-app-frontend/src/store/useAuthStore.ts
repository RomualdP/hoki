import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User, UserRole, ClubRole } from "../types";

interface AuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly role: UserRole | null;
  readonly clubId: string | null;
  readonly clubRole: ClubRole;
  _hasHydrated: boolean;
  _hasCheckedAuth: boolean;
}

interface AuthActions {
  readonly loginUser: (
    user: User,
    role?: UserRole,
    clubId?: string,
    clubRole?: ClubRole,
  ) => void;
  readonly logoutUser: () => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: string | null) => void;
  readonly clearError: () => void;
  readonly setRole: (role: UserRole) => void;
  readonly setClubInfo: (clubId: string | null, clubRole: ClubRole) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  role: null,
  clubId: null,
  clubRole: null,
  _hasHydrated: false,
  _hasCheckedAuth: false,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        loginUser: (
          user: User,
          role?: UserRole,
          clubId?: string,
          clubRole?: ClubRole,
        ) => {
          set(
            (state) => ({
              ...state,
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              role: role || user.role || "USER",
              // Extract clubId and clubRole from user object if not provided
              clubId: clubId ?? user.clubId ?? null,
              clubRole: clubRole ?? user.clubRole ?? null,
              _hasCheckedAuth: true,
            }),
            false,
            "auth/loginUser",
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
              role: null,
              clubId: null,
              clubRole: null,
              _hasCheckedAuth: true,
            }),
            false,
            "auth/logoutUser",
          );
        },

        setLoading: (isLoading: boolean) => {
          set(
            (state) => ({
              ...state,
              isLoading,
              // Mark as checked when loading finishes
              _hasCheckedAuth: !isLoading ? true : state._hasCheckedAuth,
            }),
            false,
            "auth/setLoading",
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
            "auth/setError",
          );
        },

        clearError: () => {
          set(
            (state) => ({
              ...state,
              error: null,
            }),
            false,
            "auth/clearError",
          );
        },

        setRole: (role: UserRole) => {
          set(
            (state) => ({
              ...state,
              role,
            }),
            false,
            "auth/setRole",
          );
        },

        setClubInfo: (clubId: string | null, clubRole: ClubRole) => {
          set(
            (state) => ({
              ...state,
              clubId,
              clubRole,
            }),
            false,
            "auth/setClubInfo",
          );
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          role: state.role,
          clubId: state.clubId,
          clubRole: state.clubRole,
          // Don't persist _hasHydrated and _hasCheckedAuth - they should be reset on each page load
        }),
        onRehydrateStorage: () => {
          // Store will be hydrated after this callback runs
          // We'll use a useEffect in the component to check hydration
        },
      },
    ),
    {
      name: "auth-store",
    },
  ),
);
