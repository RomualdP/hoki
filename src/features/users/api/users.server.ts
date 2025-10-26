import { serverFetch } from "@/lib/server-fetch";
import { REVALIDATE_SHORT } from "@/lib/cache-config";
import type { User, UserSkill, UserProfile } from "@/types";
import type { UserAttribute } from "../../users/hooks/useUserAttributesApi";

/**
 * Server-side API for Users
 *
 * Functions to fetch user data from Server Components
 * Uses serverFetch with httpOnly cookies for auth
 *
 * SECURITY: Backend automatically filters by clubId
 * Users can only see members from their own club
 *
 * Cache Strategy: REVALIDATE_SHORT (1 minute)
 * - User data is cached for 1 minute (user-specific, changes moderately)
 * - Pages remain dynamic (cookies() forces dynamic rendering)
 * - But data is served from cache during revalidation window
 */

interface UsersResponse {
  success: boolean;
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UserResponse {
  success: boolean;
  data: User;
}

/**
 * Get all users from authenticated user's club
 * Backend automatically filters by user's clubId
 */
export async function getClubUsers(): Promise<User[]> {
  const response = await serverFetch<UsersResponse>("/users", {
    next: { revalidate: REVALIDATE_SHORT },
  });

  return response?.data || [];
}

/**
 * Get a specific user by ID
 */
export async function getUser(userId: string): Promise<User | null> {
  const response = await serverFetch<UserResponse>(`/users/${userId}`, {
    next: { revalidate: REVALIDATE_SHORT },
  });

  return response?.data || null;
}

/**
 * Get count of users in the club
 */
export async function getClubUsersCount(): Promise<number> {
  const users = await getClubUsers();
  return users.length;
}

/**
 * Get users filtered by club role
 */
export async function getUsersByRole(
  role: "COACH" | "ASSISTANT_COACH" | "PLAYER",
): Promise<User[]> {
  const users = await getClubUsers();
  return users.filter((user) => user.clubRole === role);
}

/**
 * Get user skills
 */
interface UserSkillsResponse {
  success: boolean;
  data: UserSkill[];
}

export async function getUserSkills(userId: string): Promise<UserSkill[]> {
  const response = await serverFetch<UserSkillsResponse>(
    `/users/${userId}/skills`,
    {
      next: { revalidate: REVALIDATE_SHORT },
    },
  );

  return response?.data || [];
}

/**
 * Get user attributes (fitness, leadership)
 */
interface UserAttributesResponse {
  success: boolean;
  data: UserAttribute[];
}

export async function getUserAttributes(
  userId: string,
): Promise<UserAttribute[]> {
  const response = await serverFetch<UserAttributesResponse>(
    `/users/${userId}/attributes`,
    {
      next: { revalidate: REVALIDATE_SHORT },
    },
  );

  return response?.data || [];
}

/**
 * Get user level
 */
interface UserLevelResponse {
  success: boolean;
  data: {
    level: number;
  };
}

export async function getUserLevel(userId: string): Promise<number> {
  const response = await serverFetch<UserLevelResponse>(
    `/users/${userId}/level`,
    {
      next: { revalidate: REVALIDATE_SHORT },
    },
  );

  return response?.data?.level || 0;
}

/**
 * Get user profile
 */
interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const response = await serverFetch<UserProfileResponse>(
    `/users/${userId}/profile`,
    {
      next: { revalidate: REVALIDATE_SHORT },
    },
  );

  return response?.data || null;
}
