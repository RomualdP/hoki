import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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
import { MemberReadModelService } from '../../services/member-read-model.service';

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
    private readonly memberReadModelService: MemberReadModelService,
  ) {}

  async execute(query: ListMembersQuery): Promise<MemberListReadModel[]> {
    if (!query.userId) {
      throw new ForbiddenException('Authentication required');
    }

    const activeMembership = await this.memberRepository.findActiveByUserId(
      query.userId,
    );

    if (!activeMembership) {
      throw new ForbiddenException(
        'You must be part of a club to list members',
      );
    }

    if (query.clubId !== activeMembership.clubId) {
      throw new ForbiddenException(
        'You cannot access members from another club',
      );
    }

    const club = await this.clubRepository.findById(query.clubId);
    if (!club) {
      throw new NotFoundException(`Club ${query.clubId} not found`);
    }

    let members = await this.memberRepository.findByClubId(query.clubId);

    if (query.roleFilter) {
      const roleValue = query.roleFilter.value;
      members = members.filter((member) => member.role === roleValue);
    }

    return this.memberReadModelService.enrichMembersWithUserData(members);
  }
}
