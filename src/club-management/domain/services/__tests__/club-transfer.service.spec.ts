import { ClubTransferService } from '../club-transfer.service';
import { Member, ClubRole } from '../../entities/member.entity';

describe('ClubTransferService', () => {
  let service: ClubTransferService;

  beforeEach(() => {
    service = new ClubTransferService();
  });

  describe('validateTransfer()', () => {
    it('should allow transfer for active player to different club', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      const result = service.validateTransfer(member, 'club-2');

      expect(result.canTransfer).toBe(true);
      expect(result.warnings).toHaveLength(2);
      expect(result.warnings).toContain(
        'Player will be removed from all teams in the current club',
      );
      expect(result.warnings).toContain(
        'Player statistics will remain associated with the previous club',
      );
    });

    it('should not allow transfer to the same club', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      const result = service.validateTransfer(member, 'club-1');

      expect(result.canTransfer).toBe(false);
      expect(result.reason).toBe('Player is already a member of this club');
    });

    it('should not allow inactive member to transfer', () => {
      const member = Member.reconstitute({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        joinedAt: new Date(),
        leftAt: new Date(),
        invitedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = service.validateTransfer(member, 'club-2');

      expect(result.canTransfer).toBe(false);
      expect(result.reason).toBe(
        'Only active members can transfer to another club',
      );
    });

    it('should not allow COACH to transfer', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      const result = service.validateTransfer(member, 'club-2');

      expect(result.canTransfer).toBe(false);
      expect(result.reason).toBe(
        'Only players can transfer between clubs. Coaches and assistants must leave their current club first.',
      );
    });

    it('should not allow ASSISTANT_COACH to transfer', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.ASSISTANT_COACH,
      });

      const result = service.validateTransfer(member, 'club-2');

      expect(result.canTransfer).toBe(false);
      expect(result.reason).toBe(
        'Only players can transfer between clubs. Coaches and assistants must leave their current club first.',
      );
    });
  });

  describe('executeTransfer()', () => {
    it('should successfully execute transfer for valid player', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      const result = service.executeTransfer({
        currentMember: member,
        newClubId: 'club-2',
        newMemberId: 'member-2',
      });

      expect(result.isActive()).toBe(false);
      expect(result.leftAt).toBeInstanceOf(Date);
    });

    it('should throw when trying to transfer to same club', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      expect(() =>
        service.executeTransfer({
          currentMember: member,
          newClubId: 'club-1',
          newMemberId: 'member-2',
        }),
      ).toThrow('Player is already a member of this club');
    });

    it('should throw when trying to transfer inactive member', () => {
      const member = Member.reconstitute({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        joinedAt: new Date(),
        leftAt: new Date(),
        invitedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(() =>
        service.executeTransfer({
          currentMember: member,
          newClubId: 'club-2',
          newMemberId: 'member-2',
        }),
      ).toThrow('Only active members can transfer to another club');
    });

    it('should throw when trying to transfer coach', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      expect(() =>
        service.executeTransfer({
          currentMember: member,
          newClubId: 'club-2',
          newMemberId: 'member-2',
        }),
      ).toThrow(
        'Only players can transfer between clubs. Coaches and assistants must leave their current club first.',
      );
    });
  });

  describe('hasTransferHistory()', () => {
    it('should return false for player with single club', () => {
      const memberships = [
        Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.PLAYER,
        }),
      ];

      const result = service.hasTransferHistory(memberships);

      expect(result).toBe(false);
    });

    it('should return true for player with multiple clubs', () => {
      const memberships = [
        Member.reconstitute({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.PLAYER,
          joinedAt: new Date('2024-01-01'),
          leftAt: new Date('2024-06-01'),
          invitedBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        Member.create({
          id: 'member-2',
          userId: 'user-1',
          clubId: 'club-2',
          role: ClubRole.PLAYER,
        }),
      ];

      const result = service.hasTransferHistory(memberships);

      expect(result).toBe(true);
    });

    it('should return false for empty memberships', () => {
      const result = service.hasTransferHistory([]);

      expect(result).toBe(false);
    });
  });

  describe('getTransferCount()', () => {
    it('should return 0 for player with no transfers', () => {
      const memberships = [
        Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.PLAYER,
        }),
      ];

      const result = service.getTransferCount(memberships);

      expect(result).toBe(0);
    });

    it('should return correct count for player with transfers', () => {
      const memberships = [
        Member.reconstitute({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.PLAYER,
          joinedAt: new Date('2024-01-01'),
          leftAt: new Date('2024-06-01'),
          invitedBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        Member.reconstitute({
          id: 'member-2',
          userId: 'user-1',
          clubId: 'club-2',
          role: ClubRole.PLAYER,
          joinedAt: new Date('2024-06-02'),
          leftAt: new Date('2024-12-01'),
          invitedBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        Member.create({
          id: 'member-3',
          userId: 'user-1',
          clubId: 'club-3',
          role: ClubRole.PLAYER,
        }),
      ];

      const result = service.getTransferCount(memberships);

      expect(result).toBe(2);
    });

    it('should return 0 for empty memberships', () => {
      const result = service.getTransferCount([]);

      expect(result).toBe(0);
    });
  });

  describe('getTransferWarningMessage()', () => {
    it('should return formatted warning message', () => {
      const result = service.getTransferWarningMessage('Volleyball Club Paris');

      expect(result).toContain('You are about to leave Volleyball Club Paris');
      expect(result).toContain(
        'You will be removed from all teams in Volleyball Club Paris',
      );
      expect(result).toContain(
        'Your statistics will remain associated with Volleyball Club Paris',
      );
      expect(result).toContain('You cannot undo this action');
    });
  });

  describe('isTransferEligible()', () => {
    it('should return true for active member', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      const result = service.isTransferEligible(member);

      expect(result).toBe(true);
    });

    it('should return false for inactive member', () => {
      const member = Member.reconstitute({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        joinedAt: new Date(),
        leftAt: new Date(),
        invitedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = service.isTransferEligible(member);

      expect(result).toBe(false);
    });
  });

  describe('getDaysUntilTransferEligible()', () => {
    it('should return 0 for member who has been in club long enough', () => {
      const joinedAt = new Date();
      joinedAt.setDate(joinedAt.getDate() - 40); // 40 days ago

      const member = Member.reconstitute({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        joinedAt,
        leftAt: null,
        invitedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = service.getDaysUntilTransferEligible(member, 30);

      expect(result).toBe(0);
    });

    it('should return correct days for member who joined recently', () => {
      const joinedAt = new Date();
      joinedAt.setDate(joinedAt.getDate() - 10); // 10 days ago

      const member = Member.reconstitute({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        joinedAt,
        leftAt: null,
        invitedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = service.getDaysUntilTransferEligible(member, 30);

      expect(result).toBe(20);
    });

    it('should return null for inactive member', () => {
      const member = Member.reconstitute({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        joinedAt: new Date(),
        leftAt: new Date(),
        invitedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = service.getDaysUntilTransferEligible(member, 30);

      expect(result).toBeNull();
    });

    it('should use default 30 days when not specified', () => {
      const joinedAt = new Date();
      joinedAt.setDate(joinedAt.getDate() - 20); // 20 days ago

      const member = Member.reconstitute({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        joinedAt,
        leftAt: null,
        invitedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = service.getDaysUntilTransferEligible(member);

      expect(result).toBe(10);
    });
  });
});
