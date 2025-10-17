/**
 * Commands - Barrel Exports
 */

export * from './create-club';
export * from './update-club';
export * from './delete-club';
export * from './subscribe-to-plan';
export * from './upgrade-subscription';
export * from './cancel-subscription';
export * from './generate-invitation';
export * from './accept-invitation';
export * from './remove-member';
export * from './change-club';

import { CreateClubHandler } from './create-club';
import { UpdateClubHandler } from './update-club';
import { DeleteClubHandler } from './delete-club';
import { SubscribeToPlanHandler } from './subscribe-to-plan';
import { UpgradeSubscriptionHandler } from './upgrade-subscription';
import { CancelSubscriptionHandler } from './cancel-subscription';
import { GenerateInvitationHandler } from './generate-invitation';
import { AcceptInvitationHandler } from './accept-invitation';
import { RemoveMemberHandler } from './remove-member';
import { ChangeClubHandler } from './change-club';

// Command Handlers array for easy registration in module
export const CommandHandlers = [
  CreateClubHandler,
  UpdateClubHandler,
  DeleteClubHandler,
  SubscribeToPlanHandler,
  UpgradeSubscriptionHandler,
  CancelSubscriptionHandler,
  GenerateInvitationHandler,
  AcceptInvitationHandler,
  RemoveMemberHandler,
  ChangeClubHandler,
];
