import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { Member } from '../../domain/entities/member.entity';
import { MemberListReadModel } from '../read-models/member-list.read-model';
import { ClubRole } from '../../domain/value-objects/club-role.vo';

/**
 * MemberReadModelService - Application Service
 *
 * Responsible for enriching Member domain entities with User data
 * to create MemberListReadModel DTOs optimized for UI display.
 *
 * Separates read model transformation logic from query handlers.
 */
@Injectable()
export class MemberReadModelService {
  constructor(private readonly database: DatabaseService) {}

  /**
   * Enrich members with user data and convert to read models
   */
  async enrichMembersWithUserData(
    members: Member[],
  ): Promise<MemberListReadModel[]> {
    if (members.length === 0) {
      return [];
    }

    const userIds = members.map((member) => member.userId);
    const users = await this.database.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        clubId: true,
        clubRole: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const userMap = new Map(users.map((user) => [user.id, user]));

    return members.map((member) => this.mapToReadModel(member, userMap));
  }

  /**
   * Map a Member entity to MemberListReadModel
   */
  private mapToReadModel(
    member: Member,
    userMap: Map<
      string,
      {
        firstName: string;
        lastName: string;
        email: string;
        avatar: string | null;
      }
    >,
  ): MemberListReadModel {
    const user = userMap.get(member.userId);

    return {
      id: member.id,
      userId: member.userId,
      clubId: member.clubId,
      role: member.role,
      roleName: member.getRoleDisplayName(),
      joinedAt: member.joinedAt,
      isActive: member.isActive(),
      userFirstName: user?.firstName,
      userLastName: user?.lastName,
      userEmail: user?.email,
      userAvatar: user?.avatar ?? undefined,
      canManageClubSettings: member.canManageClubSettings(),
      canManageTeams: member.canManageTeams(),
      canInviteMembers: member.canInviteMembers(),
      canManageSubscription: member.canManageSubscription(),
      isOwner: member.role === ClubRole.OWNER,
      isCoach: member.role === ClubRole.COACH,
      isPlayer: member.role === ClubRole.PLAYER,
    };
  }
}
