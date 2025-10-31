import { serverFetch } from "@/lib/server-fetch";
import { REVALIDATE_MEDIUM } from "@/lib/cache-config";
import type { Club } from "../types/club.types";

/**
 * Server-side API for Clubs
 *
 * Functions to fetch club data from Server Components
 * Uses serverFetch with httpOnly cookies for auth
 *
 * Cache Strategy: REVALIDATE_MEDIUM (5 minutes)
 * - Club data is cached for 5 minutes
 * - Pages remain dynamic (cookies() forces dynamic rendering)
 * - But data is served from cache during revalidation window
 */

interface ClubResponse {
  success: boolean;
  data: Club;
}

/**
 * Get club by ID
 */
export async function getClub(clubId: string): Promise<Club | null> {
  const response = await serverFetch<ClubResponse>(`/clubs/${clubId}`, {
    next: { revalidate: REVALIDATE_MEDIUM },
  });

  return response?.data || null;
}

/**
 * Get current user's club
 *
 * Backend automatically fetches the club of the authenticated user
 * using the JWT token (no need to pass clubId)
 */
export async function getCurrentClub(): Promise<Club | null> {
  const response = await serverFetch<ClubResponse>("/clubs/me", {
    next: { revalidate: REVALIDATE_MEDIUM },
  });

  return response?.data || null;
}
