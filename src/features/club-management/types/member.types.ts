/**
 * Member Types
 *
 * Types for club members
 */

/**
 * Club role for members
 */
export type ClubRole = "COACH" | "ASSISTANT_COACH" | "PLAYER";

/**
 * Member detail - Matches MemberListReadModel from backend
 */
export interface Member {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: ClubRole;
  profilePictureUrl: string | null;
  joinedAt: Date;
  teamCount: number;
  canBeRemoved: boolean;
}

/**
 * DTO for removing a member
 */
export interface RemoveMemberDto {
  clubId: string;
  userId: string;
}

/**
 * Members list query params
 */
export interface ListMembersQuery {
  clubId: string;
  role?: ClubRole;
  page?: number;
  limit?: number;
}
