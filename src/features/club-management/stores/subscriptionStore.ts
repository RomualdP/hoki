/**
 * Subscription Store
 *
 * Zustand store for subscription state management
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Subscription, SubscriptionPlan } from "../types";

interface SubscriptionState {
  readonly currentSubscription: Subscription | null;
  readonly availablePlans: SubscriptionPlan[];
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface SubscriptionActions {
  readonly setCurrentSubscription: (subscription: Subscription | null) => void;
  readonly updateCurrentSubscription: (updates: Partial<Subscription>) => void;
  readonly setAvailablePlans: (plans: SubscriptionPlan[]) => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: string | null) => void;
  readonly clearError: () => void;
  readonly reset: () => void;
}

type SubscriptionStore = SubscriptionState & SubscriptionActions;

const initialState: SubscriptionState = {
  currentSubscription: null,
  availablePlans: [],
  isLoading: false,
  error: null,
};

export const useSubscriptionStore = create<SubscriptionStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setCurrentSubscription: (subscription: Subscription | null) => {
          set(
            {
              currentSubscription: subscription,
              isLoading: false,
              error: null,
            },
            false,
            "subscription/setCurrentSubscription",
          );
        },

        updateCurrentSubscription: (updates: Partial<Subscription>) => {
          set(
            (state) => ({
              currentSubscription: state.currentSubscription
                ? { ...state.currentSubscription, ...updates }
                : null,
            }),
            false,
            "subscription/updateCurrentSubscription",
          );
        },

        setAvailablePlans: (plans: SubscriptionPlan[]) => {
          set(
            {
              availablePlans: plans,
            },
            false,
            "subscription/setAvailablePlans",
          );
        },

        setLoading: (isLoading: boolean) => {
          set({ isLoading }, false, "subscription/setLoading");
        },

        setError: (error: string | null) => {
          set(
            {
              error,
              isLoading: false,
            },
            false,
            "subscription/setError",
          );
        },

        clearError: () => {
          set({ error: null }, false, "subscription/clearError");
        },

        reset: () => {
          set(initialState, false, "subscription/reset");
        },
      }),
      {
        name: "subscription-storage",
        version: 1, // Increment this to clear old cache
        partialize: (state) => ({
          currentSubscription: state.currentSubscription,
          availablePlans: state.availablePlans,
        }),
      },
    ),
    {
      name: "subscription-store",
    },
  ),
);
