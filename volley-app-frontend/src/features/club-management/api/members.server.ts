import { serverFetch } from "@/lib/server-fetch";
import { REVALIDATE_SHORT } from "@/lib/cache-config";
import { getCurrentClub } from "./club.server";
import type { User } from "@/types";

/**
 * Server-side API for Club Members
 *
 * Functions to fetch club member data from Server Components
 * Uses serverFetch with httpOnly cookies for auth
 *
 * SECURITY: Backend automatically filters by clubId
 * Users can only see members from their own club
 *
 * Cache Strategy: REVALIDATE_SHORT (1 minute)
 */

interface MemberListReadModel {
  id: string;
  userId: string;
  clubId: string;
  role: string;
  roleName: string;
  joinedAt: Date;
  isActive: boolean;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  userAvatar?: string;
  canManageClubSettings: boolean;
  canManageTeams: boolean;
  canInviteMembers: boolean;
  canManageSubscription: boolean;
  isOwner: boolean;
  isCoach: boolean;
  isPlayer: boolean;
}

interface MembersResponse {
  success: boolean;
  data: MemberListReadModel[];
}

/**
 * Get all members from authenticated user's club
 * Uses the Members table as source of truth
 */
export async function getClubMembers(): Promise<User[]> {
  const club = await getCurrentClub();

  if (!club) {
    return [];
  }

  const response = await serverFetch<MembersResponse>(
    `/clubs/${club.id}/members`,
    {
      next: { revalidate: REVALIDATE_SHORT },
    },
  );

  if (!response?.data) {
    return [];
  }
  //TODO: use a mapper to convert the response to the User type
  return response.data.map((member) => ({
    id: member.userId,
    email: member.userEmail || "",
    firstName: member.userFirstName || "",
    lastName: member.userLastName || "",
    avatar: member.userAvatar,
    role: "USER" as const,
    clubId: member.clubId,
    clubRole: member.role as "OWNER" | "COACH" | "PLAYER" | null,
    isActive: member.isActive,
    createdAt: member.joinedAt,
    updatedAt: member.joinedAt,
    lastLoginAt: undefined,
  }));
}

/**
 * Get members filtered by club role
 */
export async function getMembersByRole(
  role: "OWNER" | "COACH" | "PLAYER",
): Promise<User[]> {
  const members = await getClubMembers();
  return members.filter((member) => member.clubRole === role);
}

/**
 * Get count of members in the club
 */
export async function getClubMembersCount(): Promise<number> {
  const members = await getClubMembers();
  return members.length;
}

