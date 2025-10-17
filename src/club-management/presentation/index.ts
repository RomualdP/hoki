// Barrel exports for presentation layer
export * from './clubs.controller';
export * from './subscriptions.controller';
export * from './invitations.controller';
export * from './dtos';

// Controllers array for module registration
import { ClubsController } from './clubs.controller';
import { SubscriptionsController } from './subscriptions.controller';
import { InvitationsController } from './invitations.controller';

export const Controllers = [
  ClubsController,
  SubscriptionsController,
  InvitationsController,
];
