/**
 * MembersList Component (Smart)
 *
 * Handles fetching and displaying club members
 * Includes optimistic updates for member removal
 */

"use client";

import { useState, useEffect, useOptimistic, useTransition } from "react";
import { MemberCard } from "./MemberCard";
import * as membersApi from "../../api/members.api";
import type { Member, ClubRole } from "../../types";

export interface MembersListProps {
  readonly clubId: string;
  readonly roleFilter?: ClubRole;
  readonly showActions?: boolean;
}

export function MembersList({
  clubId,
  roleFilter,
  showActions = true,
}: MembersListProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Optimistic updates for member removal
  const [optimisticMembers, removeOptimisticMember] = useOptimistic(
    members,
    (state, removedUserId: string) =>
      state.filter((m) => m.userId !== removedUserId),
  );

  /**
   * Fetch members
   */
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await membersApi.listMembers({
          clubId,
          role: roleFilter,
        });
        setMembers(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch members";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [clubId, roleFilter]);

  /**
   * Handle member removal with optimistic update
   */
  const handleRemoveMember = async (userId: string) => {
    // Optimistic update
    startTransition(() => {
      removeOptimisticMember(userId);
    });

    try {
      await membersApi.removeMember({
        clubId,
        userId,
      });

      // Update actual state after success
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to remove member";
      setError(message);

      // Refetch to restore state on error
      const data = await membersApi.listMembers({
        clubId,
        role: roleFilter,
      });
      setMembers(data);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chargement des membres...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  // Empty state
  if (optimisticMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="mt-4 text-sm text-gray-500">
          {roleFilter
            ? `Aucun membre avec le rôle ${roleFilter}`
            : "Aucun membre"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Members Count */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          {optimisticMembers.length} membre
          {optimisticMembers.length > 1 ? "s" : ""}
        </h3>
      </div>

      {/* Members List */}
      {optimisticMembers.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          onRemove={handleRemoveMember}
          isRemoving={isPending}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
