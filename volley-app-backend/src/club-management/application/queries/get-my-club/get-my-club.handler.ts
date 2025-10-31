import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetMyClubQuery } from './get-my-club.query';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository';
import { ClubDetailReadModel } from '../../read-models/club-detail.read-model';

@Injectable()
@QueryHandler(GetMyClubQuery)
export class GetMyClubHandler
  implements IQueryHandler<GetMyClubQuery, ClubDetailReadModel>
{
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
  ) {}

  async execute(query: GetMyClubQuery): Promise<ClubDetailReadModel> {
    const activeMembership = await this.memberRepository.findActiveByUserId(
      query.userId,
    );

    if (!activeMembership) {
      throw new NotFoundException(`User has no active club membership`);
    }

    const club = await this.clubRepository.findById(activeMembership.clubId);

    if (!club) {
      throw new NotFoundException(
        `Club with ID ${activeMembership.clubId} not found`,
      );
    }

    return {
      id: club.id,
      name: club.name,
      description: club.description,
      logo: club.logo,
      location: club.location,
      ownerId: club.ownerId,
      createdAt: club.createdAt,
      updatedAt: club.updatedAt,
    };
  }
}
