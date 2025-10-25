import { serverFetch } from "@/lib/server-fetch";
import type { Club } from "../types/club.types";

/**
 * Server-side API for Clubs
 *
 * Functions to fetch club data from Server Components
 * Uses serverFetch with httpOnly cookies for auth
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
    cache: "no-store",
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
    cache: "no-store",
  });

  return response?.data || null;
}
