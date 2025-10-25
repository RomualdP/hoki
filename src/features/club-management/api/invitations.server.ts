import { serverFetch } from "@/lib/server-fetch";
import type { Invitation } from "../types/invitation.types";

/**
 * Server-side API for Invitations
 *
 * Functions to fetch invitation data from Server Components
 * Uses serverFetch with httpOnly cookies for auth
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
      cache: "no-store",
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
