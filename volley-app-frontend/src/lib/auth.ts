import { serverFetch } from "./server-fetch";
import type { User } from "../types";

interface UserResponse {
  success: boolean;
  data: User;
}

/**
 * Get authenticated user from server session
 *
 * Server-only function that retrieves the current user
 * from the backend using httpOnly cookies
 *
 * @returns Promise<User | null> - User if authenticated, null otherwise
 */
export async function getUser(): Promise<User | null> {
  try {
    const response = await serverFetch<UserResponse>("/auth/profile", {
      requireAuth: true,
      cache: "no-store",
    });

    return response?.data || null;
  } catch (error) {
    console.error("[getUser] Failed to fetch user:", error);
    return null;
  }
}

/**
 * Require authentication for a page
 *
 * Returns the user or redirects to login
 *
 * Usage in Server Component:
 * ```ts
 * const user = await requireAuth();
 * ```
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized - Please login");
  }

  return user;
}

/**
 * Require specific club role for a page
 *
 * Returns the user or throws an error if user doesn't have required role
 *
 * Usage in Server Component:
 * ```ts
 * const user = await requireRole(['OWNER', 'COACH']);
 * ```
 */
export async function requireRole(
  allowedRoles: Array<"OWNER" | "COACH" | "PLAYER">,
): Promise<User> {
  const user = await requireAuth();

  if (!user.clubRole || !allowedRoles.includes(user.clubRole)) {
    throw new Error(
      "Forbidden - You don't have permission to access this resource",
    );
  }

  return user;
}
