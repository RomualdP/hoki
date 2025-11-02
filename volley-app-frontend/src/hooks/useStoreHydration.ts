"use client";

/**
 * Hook to check if the auth store has been hydrated from localStorage
 * This prevents showing the navbar before the store is fully hydrated
 * 
 * In Next.js, we need to wait for client-side hydration to complete
 * before accessing persisted store data.
 * 
 * Zustand persist hydrates synchronously on first access to the store.
 * Since this is a client component, we can safely assume hydration
 * will complete before the first render completes.
 */
export function useStoreHydration(): boolean {
  // On server side, always return false
  // On client side, return true immediately since zustand persist
  // hydrates synchronously on first store access
  return typeof window !== "undefined";
}
