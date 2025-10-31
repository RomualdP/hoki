/**
 * useInvitation Hook
 *
 * Custom hook for invitation management operations
 */

import { useState, useCallback } from "react";
import * as invitationsApi from "../api/invitations.api";
import type { GenerateInvitationDto, AcceptInvitationDto } from "../types";

export function useInvitation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate an invitation link
   */
  const generateInvitation = useCallback(
    async (data: GenerateInvitationDto) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await invitationsApi.generateInvitation(data);
        return result;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to generate invitation";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Validate an invitation token
   */
  const validateInvitation = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const validation = await invitationsApi.validateInvitation(token);
      return validation;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to validate invitation";
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Accept an invitation
   */
  const acceptInvitation = useCallback(async (data: AcceptInvitationDto) => {
    setIsLoading(true);
    setError(null);

    try {
      await invitationsApi.acceptInvitation(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to accept invitation";
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get invitation details by token
   */
  const getInvitation = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const invitation = await invitationsApi.getInvitation(token);
      return invitation;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get invitation";
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Build full invitation URL
   */
  const buildInvitationUrl = useCallback(
    (token: string, type: "COACH" | "PLAYER") => {
      const baseUrl = window.location.origin;
      const path =
        type === "COACH" ? "/signup/coach" : "/signup/player";
      return `${baseUrl}${path}?invitation=${token}`;
    },
    [],
  );

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    generateInvitation,
    validateInvitation,
    acceptInvitation,
    getInvitation,
    buildInvitationUrl,
    clearError,
  };
}
