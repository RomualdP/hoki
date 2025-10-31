/**
 * Repository Interfaces - Barrel Exports
 *
 * Domain repository contracts (to be implemented in Infrastructure layer):
 * - IClubRepository: Club persistence operations
 * - ISubscriptionRepository: Subscription persistence operations
 * - IInvitationRepository: Invitation persistence operations
 * - IMemberRepository: Member persistence operations
 */

export * from './club.repository';
export * from './subscription.repository';
export * from './invitation.repository';
export * from './member.repository';
