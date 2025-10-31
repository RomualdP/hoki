import { Member } from '../member.entity';
import { ClubRole } from '../../value-objects/club-role.vo';

describe('Member Entity', () => {
  describe('create()', () => {
    it('should successfully create a member with PLAYER role', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      expect(member.id).toBe('member-1');
      expect(member.userId).toBe('user-1');
      expect(member.clubId).toBe('club-1');
      expect(member.role).toBe(ClubRole.PLAYER);
      expect(member.isActive()).toBe(true);
      expect(member.joinedAt).toBeInstanceOf(Date);
    });

    it('should create member with OWNER role', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      expect(member.role).toBe(ClubRole.OWNER);
    });

    it('should create member with COACH role', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      expect(member.role).toBe(ClubRole.COACH);
    });
  });

  describe('reconstitute()', () => {
    it('should reconstitute member from persisted data', () => {
      const joinedAt = new Date('2025-01-01');

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

      expect(member.id).toBe('member-1');
      expect(member.joinedAt).toEqual(joinedAt);
    });
  });

  describe('Role checks', () => {
    it('role should be OWNER for OWNER role', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      expect(member.role).toBe(ClubRole.OWNER);
    });

    it('role should be COACH for COACH role', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      expect(member.role).toBe(ClubRole.COACH);
    });

    it('role should be PLAYER for PLAYER role', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      expect(member.role).toBe(ClubRole.PLAYER);
    });
  });

  describe('Permission checks', () => {
    describe('canManageClubSettings()', () => {
      it('should return true for OWNER', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.OWNER,
        });

        expect(member.canManageClubSettings()).toBe(true);
      });

      it('should return false for COACH', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.COACH,
        });

        expect(member.canManageClubSettings()).toBe(false);
      });

      it('should return false for PLAYER', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.PLAYER,
        });

        expect(member.canManageClubSettings()).toBe(false);
      });
    });

    describe('canManageTeams()', () => {
      it('should return true for OWNER', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.OWNER,
        });

        expect(member.canManageTeams()).toBe(true);
      });

      it('should return true for COACH', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.COACH,
        });

        expect(member.canManageTeams()).toBe(true);
      });

      it('should return false for PLAYER', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.PLAYER,
        });

        expect(member.canManageTeams()).toBe(false);
      });
    });

    describe('canInviteMembers()', () => {
      it('should return true for OWNER', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.OWNER,
        });

        expect(member.canInviteMembers()).toBe(true);
      });

      it('should return true for COACH', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.COACH,
        });

        expect(member.canInviteMembers()).toBe(true);
      });

      it('should return false for PLAYER', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.PLAYER,
        });

        expect(member.canInviteMembers()).toBe(false);
      });
    });

    describe('canManageSubscription()', () => {
      it('should return true for OWNER', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.OWNER,
        });

        expect(member.canManageSubscription()).toBe(true);
      });

      it('should return false for COACH', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.COACH,
        });

        expect(member.canManageSubscription()).toBe(false);
      });

      it('should return false for PLAYER', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.PLAYER,
        });

        expect(member.canManageSubscription()).toBe(false);
      });
    });

    describe('canRemoveMembers()', () => {
      it('should return true for OWNER', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.OWNER,
        });

        expect(member.canRemoveMembers()).toBe(true);
      });

      it('should return true for COACH', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.COACH,
        });

        expect(member.canRemoveMembers()).toBe(true);
      });

      it('should return false for PLAYER', () => {
        const member = Member.create({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.PLAYER,
        });

        expect(member.canRemoveMembers()).toBe(false);
      });
    });
  });

  describe('changeRole()', () => {
    it('should successfully change role from PLAYER to COACH', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      member.changeRole(ClubRole.COACH);

      expect(member.role).toBe(ClubRole.COACH);
    });

    it('should successfully change role from COACH to PLAYER', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      member.changeRole(ClubRole.PLAYER);

      expect(member.role).toBe(ClubRole.PLAYER);
    });

    it('should throw error when trying to change to OWNER role', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      expect(() => member.changeRole(ClubRole.OWNER)).toThrow(
        'Cannot promote to OWNER role. Use ownership transfer instead.',
      );
    });
  });

  describe('markAsLeft()', () => {
    it('should successfully mark an active member as left', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      expect(member.isActive()).toBe(true);

      member.markAsLeft();

      expect(member.isActive()).toBe(false);
    });

    it('should throw error when trying to mark already left member', () => {
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

      expect(() => member.markAsLeft()).toThrow(
        'Member has already left the club',
      );
    });

    it('should throw error when OWNER tries to leave', () => {
      const member = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      expect(() => member.markAsLeft()).toThrow(
        'Owner cannot leave their own club. Club must be deleted or transferred.',
      );
    });
  });
});
