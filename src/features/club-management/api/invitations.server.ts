import { serverFetch } from "@/lib/server-fetch";
import { REVALIDATE_SHORT } from "@/lib/cache-config";
import type { Invitation } from "../types/invitation.types";

/**
 * Server-side API for Invitations
 *
 * Functions to fetch invitation data from Server Components
 * Uses serverFetch with httpOnly cookies for auth
 *
 * Cache Strategy: REVALIDATE_SHORT (1 minute)
 * - Invitation data is cached for 1 minute (user-specific, changes frequently)
 * - Pages remain dynamic (cookies() forces dynamic rendering)
 * - But data is served from cache during revalidation window
 */

interface InvitationsResponse {
  success: boolean;
  data: Invitation[];
}

/**
 * Get all pending invitations for a club
 */
export async function getInvitations(clubId: string): Promise<Invitation[]> {
  const response = await serverFetch<InvitationsResponse>(
    `/invitations/club/${clubId}`,
    {
      next: { revalidate: REVALIDATE_SHORT },
    },
  );

  return response?.data || [];
}

/**
 * Get pending invitations count
 */
export async function getPendingInvitationsCount(
  clubId: string,
): Promise<number> {
  const invitations = await getInvitations(clubId);
  return invitations.filter((inv) => inv.isValid && !inv.isUsed).length;
}
