/**
 * Read Model for club member list items
 * Optimized for member management UI
 */
export interface MemberListReadModel {
  id: string;
  userId: string;
  clubId: string;
  role: string; // 'OWNER' | 'COACH' | 'PLAYER'
  roleName: string; // Localized role name for display
  joinedAt: Date;
  isActive: boolean;

  // User information (denormalized for performance)
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  userAvatar?: string;

  // Computed permissions for UI
  canManageClubSettings: boolean;
  canManageTeams: boolean;
  canInviteMembers: boolean;
  canManageSubscription: boolean;

  // Role checks for UI
  isOwner: boolean;
  isCoach: boolean;
  isPlayer: boolean;
}
