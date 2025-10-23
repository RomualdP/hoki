/**
 * useClub Hook
 *
 * Custom hook for club management operations
 */

import { useCallback } from "react";
import { useClubStore } from "../stores";
import * as clubsApi from "../api/clubs.api";
import type { CreateClubDto, UpdateClubDto } from "../types";

export function useClub() {
  const {
    currentClub,
    isLoading,
    error,
    setCurrentClub,
    updateCurrentClub,
    setLoading,
    setError,
    clearError,
    reset,
  } = useClubStore();

  /**
   * Fetch club by ID and set as current club
   */
  const fetchClub = useCallback(
    async (clubId: string) => {
      setLoading(true);
      clearError();

      try {
        const club = await clubsApi.getClub(clubId);
        setCurrentClub(club);
        return club;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch club";
        setError(message);
        throw error;
      }
    },
    [setLoading, clearError, setCurrentClub, setError],
  );

  /**
   * Create a new club
   */
  const createClub = useCallback(
    async (data: CreateClubDto) => {
      setLoading(true);
      clearError();

      try {
        const result = await clubsApi.createClub(data);
        // Fetch the created club to get full details
        await fetchClub(result.id);
        return result;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create club";
        setError(message);
        throw error;
      }
    },
    [setLoading, clearError, fetchClub, setError],
  );

  /**
   * Update current club
   */
  const updateClub = useCallback(
    async (data: UpdateClubDto) => {
      if (!currentClub) {
        throw new Error("No current club to update");
      }

      setLoading(true);
      clearError();

      try {
        await clubsApi.updateClub(currentClub.id, data);
        updateCurrentClub(data);
        return currentClub;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update club";
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentClub, setLoading, clearError, updateCurrentClub, setError],
  );

  /**
   * Delete current club
   */
  const deleteClub = useCallback(async () => {
    if (!currentClub) {
      throw new Error("No current club to delete");
    }

    setLoading(true);
    clearError();

    try {
      await clubsApi.deleteClub(currentClub.id);
      reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete club";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentClub, setLoading, clearError, reset, setError]);

  return {
    // State
    currentClub,
    isLoading,
    error,

    // Actions
    fetchClub,
    createClub,
    updateClub,
    deleteClub,
    clearError,
    reset,
  };
}
