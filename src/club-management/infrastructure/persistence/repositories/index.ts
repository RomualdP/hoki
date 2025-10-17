// Barrel exports for repository implementations
export * from './club.repository.impl';
export * from './subscription.repository.impl';
export * from './invitation.repository.impl';
export * from './member.repository.impl';

// Repository providers array for module registration
import { ClubRepositoryImpl } from './club.repository.impl';
import { SubscriptionRepositoryImpl } from './subscription.repository.impl';
import { InvitationRepositoryImpl } from './invitation.repository.impl';
import { MemberRepositoryImpl } from './member.repository.impl';
import {
  CLUB_REPOSITORY,
  SUBSCRIPTION_REPOSITORY,
  INVITATION_REPOSITORY,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories';

export const RepositoryProviders = [
  {
    provide: CLUB_REPOSITORY,
    useClass: ClubRepositoryImpl,
  },
  {
    provide: SUBSCRIPTION_REPOSITORY,
    useClass: SubscriptionRepositoryImpl,
  },
  {
    provide: INVITATION_REPOSITORY,
    useClass: InvitationRepositoryImpl,
  },
  {
    provide: MEMBER_REPOSITORY,
    useClass: MemberRepositoryImpl,
  },
];
