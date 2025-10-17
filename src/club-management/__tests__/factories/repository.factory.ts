import { IClubRepository } from '../../domain/repositories/club.repository';
import { ISubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { IInvitationRepository } from '../../domain/repositories/invitation.repository';
import { IMemberRepository } from '../../domain/repositories/member.repository';

/**
 * Factory to create mock repositories for testing
 * Centralizes repository mock definitions to avoid duplication across test files
 *
 * Usage:
 * ```typescript
 * const clubRepository = TestRepositoryFactory.createMockClubRepository();
 * clubRepository.findById.mockResolvedValue(mockClub);
 * ```
 */
export class TestRepositoryFactory {
  /**
   * Creates a mock ClubRepository with all methods stubbed
   */
  static createMockClubRepository(): jest.Mocked<IClubRepository> {
    return {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
      findAll: jest.fn(),
      existsByName: jest.fn(),
      getAllClubNames: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };
  }

  /**
   * Creates a mock SubscriptionRepository with all methods stubbed
   */
  static createMockSubscriptionRepository(): jest.Mocked<ISubscriptionRepository> {
    return {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByClubId: jest.fn(),
      findByStripeSubscriptionId: jest.fn(),
      findByStripeCustomerId: jest.fn(),
      findByPlanId: jest.fn(),
      findAllActive: jest.fn(),
      findExpiringSubscriptions: jest.fn(),
      findCanceledButActive: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      countByPlanId: jest.fn(),
    };
  }

  /**
   * Creates a mock InvitationRepository with all methods stubbed
   */
  static createMockInvitationRepository(): jest.Mocked<IInvitationRepository> {
    return {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByToken: jest.fn(),
      findByClubId: jest.fn(),
      findByCreatorId: jest.fn(),
      findByType: jest.fn(),
      findValidByClubId: jest.fn(),
      findExpired: jest.fn(),
      findUsed: jest.fn(),
      findUsedByUserId: jest.fn(),
      existsByToken: jest.fn(),
      delete: jest.fn(),
      deleteExpired: jest.fn(),
      countByClubId: jest.fn(),
      countValidByClubId: jest.fn(),
    };
  }

  /**
   * Creates a mock MemberRepository with all methods stubbed
   */
  static createMockMemberRepository(): jest.Mocked<IMemberRepository> {
    return {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByUserIdAndClubId: jest.fn(),
      findByClubId: jest.fn(),
      findActiveByClubId: jest.fn(),
      findByClubIdAndRole: jest.fn(),
      findActiveByClubIdAndRole: jest.fn(),
      findByUserId: jest.fn(),
      findActiveByUserId: jest.fn(),
      findByInviterId: jest.fn(),
      existsByUserIdAndClubId: jest.fn(),
      delete: jest.fn(),
      countByClubId: jest.fn(),
      countActiveByClubId: jest.fn(),
      countByClubIdAndRole: jest.fn(),
    };
  }
}
