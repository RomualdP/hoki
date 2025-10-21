/**
 * Members API Client
 *
 * API client for club member management endpoints
 */

import { get, del } from "./api-client";
import type { Member, RemoveMemberDto, ListMembersQuery } from "../types";

/**
 * List members of a club
 */
export async function listMembers(query: ListMembersQuery): Promise<Member[]> {
  const params = new URLSearchParams();
  params.append("clubId", query.clubId);

  if (query.role) {
    params.append("role", query.role);
  }
  if (query.page) {
    params.append("page", query.page.toString());
  }
  if (query.limit) {
    params.append("limit", query.limit.toString());
  }

  return get<Member[]>(`/members?${params.toString()}`);
}

/**
 * Remove a member from a club
 */
export async function removeMember(data: RemoveMemberDto): Promise<void> {
  return del<void>(`/members/${data.clubId}/${data.userId}`);
}
