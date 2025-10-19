/**
 * Domain Exceptions for Club Management Bounded Context
 *
 * These exceptions represent business rule violations and domain-specific errors.
 * Each exception has a unique error code for client-side handling.
 */

import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

/**
 * Error codes for club management domain
 * Format: {ENTITY}_{ERROR_TYPE}
 */
export enum ClubManagementErrorCode {
  // Club errors (CLUB_xxx)
  CLUB_NOT_FOUND = 'CLUB_NOT_FOUND',
  CLUB_NAME_EMPTY = 'CLUB_NAME_EMPTY',
  CLUB_NAME_TOO_LONG = 'CLUB_NAME_TOO_LONG',
  CLUB_NAME_EXISTS = 'CLUB_NAME_EXISTS',
  CLUB_OWNER_REQUIRED = 'CLUB_OWNER_REQUIRED',

  // Subscription errors (SUB_xxx)
  SUBSCRIPTION_NOT_FOUND = 'SUB_NOT_FOUND',
  SUBSCRIPTION_LIMIT_EXCEEDED = 'SUB_LIMIT_EXCEEDED',
  SUBSCRIPTION_ALREADY_ACTIVE = 'SUB_ALREADY_ACTIVE',
  SUBSCRIPTION_ALREADY_CANCELED = 'SUB_ALREADY_CANCELED',
  SUBSCRIPTION_INACTIVE = 'SUB_INACTIVE',
  SUBSCRIPTION_CANNOT_DOWNGRADE = 'SUB_CANNOT_DOWNGRADE',
  SUBSCRIPTION_ALREADY_ON_PLAN = 'SUB_ALREADY_ON_PLAN',
  SUBSCRIPTION_INVALID_PLAN = 'SUB_INVALID_PLAN',
  SUBSCRIPTION_CLUB_REQUIRED = 'SUB_CLUB_REQUIRED',
  SUBSCRIPTION_PRICE_NEGATIVE = 'SUB_PRICE_NEGATIVE',
  SUBSCRIPTION_MAX_TEAMS_NEGATIVE = 'SUB_MAX_TEAMS_NEGATIVE',
  SUBSCRIPTION_PLAN_NOT_FOUND = 'SUB_PLAN_NOT_FOUND',
  SUBSCRIPTION_PLAN_NAME_EMPTY = 'SUB_PLAN_NAME_EMPTY',
  SUBSCRIPTION_PLAN_PRICE_NEGATIVE = 'SUB_PLAN_PRICE_NEGATIVE',
  SUBSCRIPTION_PLAN_MAX_TEAMS_NEGATIVE = 'SUB_PLAN_MAX_TEAMS_NEGATIVE',

  // Invitation errors (INV_xxx)
  INVITATION_NOT_FOUND = 'INV_NOT_FOUND',
  INVITATION_EXPIRED = 'INV_EXPIRED',
  INVITATION_ALREADY_USED = 'INV_ALREADY_USED',
  INVITATION_INVALID = 'INV_INVALID',
  INVITATION_TOKEN_EMPTY = 'INV_TOKEN_EMPTY',
  INVITATION_CLUB_REQUIRED = 'INV_CLUB_REQUIRED',
  INVITATION_CREATOR_REQUIRED = 'INV_CREATOR_REQUIRED',
  INVITATION_CANNOT_ACCEPT_OWN = 'INV_CANNOT_ACCEPT_OWN',
  INVITATION_USER_ID_REQUIRED = 'INV_USER_ID_REQUIRED',
  INVITATION_TYPE_INVALID = 'INV_TYPE_INVALID',

  // Member errors (MEM_xxx)
  MEMBER_NOT_FOUND = 'MEM_NOT_FOUND',
  MEMBER_ALREADY_INACTIVE = 'MEM_ALREADY_INACTIVE',
  MEMBER_ALREADY_HAS_ROLE = 'MEM_ALREADY_HAS_ROLE',
  MEMBER_CANNOT_CHANGE_ROLE = 'MEM_CANNOT_CHANGE_ROLE',
  MEMBER_CANNOT_REMOVE_SELF = 'MEM_CANNOT_REMOVE_SELF',
  MEMBER_INSUFFICIENT_PERMISSIONS = 'MEM_INSUFFICIENT_PERMISSIONS',
  MEMBER_USER_REQUIRED = 'MEM_USER_REQUIRED',
  MEMBER_CLUB_REQUIRED = 'MEM_CLUB_REQUIRED',
  MEMBER_INACTIVE = 'MEM_INACTIVE',
  MEMBER_LEFT_AT_REQUIRED = 'MEM_LEFT_AT_REQUIRED',
  MEMBER_ROLE_INVALID = 'MEM_ROLE_INVALID',

  // Transfer errors (TRANSFER_xxx)
  TRANSFER_INVALID_TEAMS_COUNT = 'TRANSFER_INVALID_TEAMS_COUNT',
  TRANSFER_LIMIT_EXCEEDED = 'TRANSFER_LIMIT_EXCEEDED',
}

// ============================================================================
// CLUB EXCEPTIONS
// ============================================================================

export class ClubNotFoundException extends NotFoundException {
  constructor(clubId: string) {
    super({
      code: ClubManagementErrorCode.CLUB_NOT_FOUND,
      message: `Club with ID ${clubId} not found`,
    });
  }
}

export class ClubNameEmptyException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.CLUB_NAME_EMPTY,
      message: 'Club name cannot be empty',
    });
  }
}

export class ClubNameTooLongException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.CLUB_NAME_TOO_LONG,
      message: 'Club name cannot exceed 100 characters',
    });
  }
}

export class ClubNameAlreadyExistsException extends ConflictException {
  constructor(clubName: string) {
    super({
      code: ClubManagementErrorCode.CLUB_NAME_EXISTS,
      message: 'A club with this name already exists',
    });
  }
}

export class ClubOwnerRequiredException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.CLUB_OWNER_REQUIRED,
      message: 'Club must have an owner',
    });
  }
}

// ============================================================================
// SUBSCRIPTION EXCEPTIONS
// ============================================================================

export class SubscriptionNotFoundException extends NotFoundException {
  constructor(message = 'Subscription not found') {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_NOT_FOUND,
      message,
    });
  }
}

export class SubscriptionLimitExceededException extends BadRequestException {
  constructor(teamsToCreate: number, remaining: number) {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_LIMIT_EXCEEDED,
      message: `Cannot create ${teamsToCreate} teams. Only ${remaining} team(s) remaining in your plan.`,
    });
  }
}

export class SubscriptionAlreadyActiveException extends ConflictException {
  constructor() {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_ALREADY_ACTIVE,
      message: 'Club already has an active subscription',
    });
  }
}

export class SubscriptionAlreadyCanceledException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_ALREADY_CANCELED,
      message: 'Subscription is already canceled',
    });
  }
}

export class SubscriptionInactiveException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_INACTIVE,
      message:
        'Your subscription is not active. Please renew or upgrade your subscription.',
    });
  }
}

export class CannotDowngradeSubscriptionException extends BadRequestException {
  constructor(planName: string) {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_CANNOT_DOWNGRADE,
      message: `Can only upgrade to a higher plan. Cannot downgrade to ${planName}`,
    });
  }
}

export class CannotUpgradeFromBETAPlanException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_CANNOT_DOWNGRADE,
      message: 'Cannot upgrade from BETA plan',
    });
  }
}

export class AlreadySubscribedToPlanException extends BadRequestException {
  constructor(planName: string) {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_ALREADY_ON_PLAN,
      message: `Already subscribed to this plan`,
    });
  }
}

export class InvalidSubscriptionPlanException extends BadRequestException {
  constructor(planId: string) {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_INVALID_PLAN,
      message: `Invalid plan ID: ${planId}`,
    });
  }
}

export class SubscriptionClubRequiredException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_CLUB_REQUIRED,
      message: 'Subscription must be associated with a club',
    });
  }
}

export class SubscriptionPriceNegativeException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_PRICE_NEGATIVE,
      message: 'Price cannot be negative',
    });
  }
}

export class SubscriptionMaxTeamsNegativeException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_MAX_TEAMS_NEGATIVE,
      message: 'Maximum number of teams cannot be negative',
    });
  }
}

export class SubscriptionPlanNotFoundException extends NotFoundException {
  constructor(planId: string) {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_PLAN_NOT_FOUND,
      message: `Plan with ID ${planId} not found`,
    });
  }
}

export class SubscriptionPlanNameEmptyException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_PLAN_NAME_EMPTY,
      message: 'Plan name cannot be empty',
    });
  }
}

export class SubscriptionPlanPriceNegativeException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_PLAN_PRICE_NEGATIVE,
      message: 'Plan price cannot be negative',
    });
  }
}

export class SubscriptionPlanMaxTeamsNegativeException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.SUBSCRIPTION_PLAN_MAX_TEAMS_NEGATIVE,
      message: 'Plan maximum number of teams cannot be negative',
    });
  }
}

// ============================================================================
// INVITATION EXCEPTIONS
// ============================================================================

export class InvitationNotFoundException extends NotFoundException {
  constructor(message = 'Invitation not found') {
    super({
      code: ClubManagementErrorCode.INVITATION_NOT_FOUND,
      message,
    });
  }
}

export class InvitationExpiredException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.INVITATION_EXPIRED,
      message: 'Invitation has expired',
    });
  }
}

export class InvitationAlreadyUsedException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.INVITATION_ALREADY_USED,
      message: 'Invitation has already been used',
    });
  }
}

export class InvalidInvitationException extends BadRequestException {
  constructor(reason: string) {
    super({
      code: ClubManagementErrorCode.INVITATION_INVALID,
      message: `Invalid invitation: ${reason}`,
    });
  }
}

export class InvitationTokenEmptyException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.INVITATION_TOKEN_EMPTY,
      message: 'Invitation token cannot be empty',
    });
  }
}

export class InvitationClubRequiredException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.INVITATION_CLUB_REQUIRED,
      message: 'Invitation must be associated with a club',
    });
  }
}

export class InvitationCreatorRequiredException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.INVITATION_CREATOR_REQUIRED,
      message: 'Invitation must have a creator',
    });
  }
}

export class CannotAcceptOwnInvitationException extends ForbiddenException {
  constructor() {
    super({
      code: ClubManagementErrorCode.INVITATION_CANNOT_ACCEPT_OWN,
      message: 'Cannot accept your own invitation',
    });
  }
}

export class InvitationUserIdRequiredException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.INVITATION_USER_ID_REQUIRED,
      message: 'User ID is required to mark invitation as used',
    });
  }
}

export class InvalidInvitationTypeException extends BadRequestException {
  constructor(type: string) {
    super({
      code: ClubManagementErrorCode.INVITATION_TYPE_INVALID,
      message: `Invalid invitation type: ${type}`,
    });
  }
}

// ============================================================================
// MEMBER EXCEPTIONS
// ============================================================================

export class MemberNotFoundException extends NotFoundException {
  constructor(message = 'Member not found') {
    super({
      code: ClubManagementErrorCode.MEMBER_NOT_FOUND,
      message,
    });
  }
}

export class MemberAlreadyInactiveException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.MEMBER_ALREADY_INACTIVE,
      message: 'Member has already left the club',
    });
  }
}

export class MemberAlreadyHasRoleException extends BadRequestException {
  constructor(roleName: string) {
    super({
      code: ClubManagementErrorCode.MEMBER_ALREADY_HAS_ROLE,
      message: `Member already has role ${roleName}`,
    });
  }
}

export class CannotChangeMemberRoleException extends BadRequestException {
  constructor(reason: string) {
    super({
      code: ClubManagementErrorCode.MEMBER_CANNOT_CHANGE_ROLE,
      message: `Cannot change member role: ${reason}`,
    });
  }
}

export class CannotRemoveSelfException extends ForbiddenException {
  constructor() {
    super({
      code: ClubManagementErrorCode.MEMBER_CANNOT_REMOVE_SELF,
      message: 'Cannot remove yourself from the club',
    });
  }
}

export class MemberInsufficientPermissionsException extends ForbiddenException {
  constructor() {
    super({
      code: ClubManagementErrorCode.MEMBER_INSUFFICIENT_PERMISSIONS,
      message: 'Only club owner can remove members',
    });
  }
}

export class MemberUserRequiredException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.MEMBER_USER_REQUIRED,
      message: 'Member must be associated with a user',
    });
  }
}

export class MemberClubRequiredException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.MEMBER_CLUB_REQUIRED,
      message: 'Member must be associated with a club',
    });
  }
}

export class MemberInactiveException extends BadRequestException {
  constructor(operation: string) {
    super({
      code: ClubManagementErrorCode.MEMBER_INACTIVE,
      message: `Cannot ${operation} on inactive member`,
    });
  }
}

export class MemberLeftAtRequiredException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.MEMBER_LEFT_AT_REQUIRED,
      message: 'Left at date is required for members who have left',
    });
  }
}

export class InvalidMemberRoleException extends BadRequestException {
  constructor(role: string) {
    super({
      code: ClubManagementErrorCode.MEMBER_ROLE_INVALID,
      message: `Invalid member role: ${role}`,
    });
  }
}

// ============================================================================
// TRANSFER EXCEPTIONS
// ============================================================================

export class InvalidTeamsCountException extends BadRequestException {
  constructor() {
    super({
      code: ClubManagementErrorCode.TRANSFER_INVALID_TEAMS_COUNT,
      message: 'Number of teams to create must be at least 1',
    });
  }
}

export class TransferLimitExceededException extends BadRequestException {
  constructor(message: string) {
    super({
      code: ClubManagementErrorCode.TRANSFER_LIMIT_EXCEEDED,
      message,
    });
  }
}
