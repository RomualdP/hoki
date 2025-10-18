import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ListMembersQuery } from './list-members.query';
import { MemberListReadModel } from '../../read-models/member-list.read-model';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';
import { ClubRole } from '../../../domain/value-objects/club-role.vo';

@Injectable()
@QueryHandler(ListMembersQuery)
export class ListMembersHandler
  implements IQueryHandler<ListMembersQuery, MemberListReadModel[]>
{
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
  ) {}

  async execute(query: ListMembersQuery): Promise<MemberListReadModel[]> {
    // Vérifier que le club existe
    const club = await this.clubRepository.findById(query.clubId);
    if (!club) {
      throw new NotFoundException(`Club ${query.clubId} not found`);
    }

    // Récupérer les membres du club avec filtre optionnel sur le rôle
    let members = await this.memberRepository.findByClubId(query.clubId);

    if (query.roleFilter) {
      const roleValue = query.roleFilter.value;
      members = members.filter((member) => member.role === roleValue);
    }

    // Mapper vers le read model
    return members.map((member) => ({
      id: member.id,
      userId: member.userId,
      clubId: member.clubId,
      role: member.role,
      roleName: member.getRoleDisplayName(),
      joinedAt: member.joinedAt,
      isActive: member.isActive(),
      // Permissions calculées pour l'UI
      canManageClubSettings: member.canManageClubSettings(),
      canManageTeams: member.canManageTeams(),
      canInviteMembers: member.canInviteMembers(),
      canManageSubscription: member.canManageSubscription(),
      isCoach: member.role === ClubRole.COACH,
      isAssistantCoach: member.role === ClubRole.ASSISTANT_COACH,
      isPlayer: member.role === ClubRole.PLAYER,
    }));
  }
}
