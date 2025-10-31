/**
 * Club Types
 *
 * Types for club entities and operations
 */

/**
 * Club detail - Matches ClubDetailReadModel from backend
 */
export interface Club {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Club list item - Matches ClubListReadModel from backend
 */
export interface ClubListItem {
  id: string;
  name: string;
  logoUrl: string | null;
  memberCount: number;
  teamCount: number;
}

/**
 * DTO for creating a club
 */
export interface CreateClubDto {
  name: string;
  description?: string;
  logoUrl?: string;
}

/**
 * DTO for updating a club
 */
export interface UpdateClubDto {
  name?: string;
  description?: string;
  logoUrl?: string;
}
