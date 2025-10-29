// Barrel exports for queries
export * from './get-club';
export * from './get-my-club';
export * from './list-clubs';
export * from './get-subscription';
export * from './list-subscription-plans';
export * from './validate-invitation';
export * from './list-members';

// Query handlers array for module registration
import { GetClubHandler } from './get-club';
import { GetMyClubHandler } from './get-my-club';
import { ListClubsHandler } from './list-clubs';
import { GetSubscriptionHandler } from './get-subscription';
import { ListSubscriptionPlansHandler } from './list-subscription-plans';
import { ValidateInvitationHandler } from './validate-invitation';
import { ListMembersHandler } from './list-members';

export const QueryHandlers = [
  GetClubHandler,
  GetMyClubHandler,
  ListClubsHandler,
  GetSubscriptionHandler,
  ListSubscriptionPlansHandler,
  ValidateInvitationHandler,
  ListMembersHandler,
];
