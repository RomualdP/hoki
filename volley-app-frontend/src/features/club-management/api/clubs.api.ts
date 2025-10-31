/**
 * Clubs API Client
 *
 * API client for club-related endpoints
 */

import { get, post, patch, del } from "./api-client";
import type {
  Club,
  ClubListItem,
  CreateClubDto,
  UpdateClubDto,
} from "../types";

/**
 * Get club by ID
 */
export async function getClub(clubId: string): Promise<Club> {
  return get<Club>(`/clubs/${clubId}`);
}

/**
 * List all clubs (for admin or multi-club scenarios)
 */
export async function listClubs(): Promise<ClubListItem[]> {
  return get<ClubListItem[]>("/clubs");
}

/**
 * Create a new club
 */
export async function createClub(data: CreateClubDto): Promise<{ id: string }> {
  return post<{ id: string }>("/clubs", data);
}

/**
 * Update club information
 */
export async function updateClub(
  clubId: string,
  data: UpdateClubDto,
): Promise<void> {
  return patch<void>(`/clubs/${clubId}`, data);
}

/**
 * Delete a club
 */
export async function deleteClub(clubId: string): Promise<void> {
  return del<void>(`/clubs/${clubId}`);
}
