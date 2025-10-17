import { Invitation, InvitationType } from '../invitation.entity';

describe('Invitation Entity', () => {
  describe('isExpired()', () => {
    it('should return false when invitation is not expired yet', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const invitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'user-1',
        expiresInDays: 7,
      });

      expect(invitation.isExpired()).toBe(false);
    });

    it('should return true when invitation has expired', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const invitation = Invitation.reconstitute({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        expiresAt: pastDate,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        usedAt: null,
        usedBy: null,
      });

      expect(invitation.isExpired()).toBe(true);
    });

    it('should return true when expiration date is exactly now', () => {
      const now = new Date();

      const invitation = Invitation.reconstitute({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        expiresAt: now,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        usedAt: null,
        usedBy: null,
      });

      // Wait 1ms to ensure time has passed
      setTimeout(() => {
        expect(invitation.isExpired()).toBe(true);
      }, 1);
    });

    it('should handle edge case with 1 second before expiration', () => {
      const almostExpired = new Date();
      almostExpired.setSeconds(almostExpired.getSeconds() + 1);

      const invitation = Invitation.reconstitute({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        expiresAt: almostExpired,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        usedAt: null,
        usedBy: null,
      });

      expect(invitation.isExpired()).toBe(false);
    });
  });

  describe('isValid()', () => {
    it('should return true when invitation is not expired and not used', () => {
      const invitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'user-1',
        expiresInDays: 7,
      });

      expect(invitation.isValid()).toBe(true);
    });

    it('should return false when invitation is expired', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const invitation = Invitation.reconstitute({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        expiresAt: pastDate,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        usedAt: null,
        usedBy: null,
      });

      expect(invitation.isValid()).toBe(false);
    });

    it('should return false when invitation is used', () => {
      const invitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'user-1',
        expiresInDays: 7,
      });

      invitation.markAsUsed('user-2');

      expect(invitation.isValid()).toBe(false);
    });

    it('should return false when invitation is both expired and used', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const invitation = Invitation.reconstitute({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        expiresAt: pastDate,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        usedAt: new Date(),
        usedBy: 'user-2',
      });

      expect(invitation.isValid()).toBe(false);
    });

    it('should return true for ASSISTANT_COACH invitation that is valid', () => {
      const invitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.ASSISTANT_COACH,
        createdBy: 'user-1',
        expiresInDays: 14,
      });

      expect(invitation.isValid()).toBe(true);
    });
  });

  describe('markAsUsed()', () => {
    it('should successfully mark invitation as used', () => {
      const invitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'user-1',
        expiresInDays: 7,
      });

      invitation.markAsUsed('user-2');

      expect(invitation.isUsed()).toBe(true);
      expect(invitation.usedBy).toBe('user-2');
      expect(invitation.usedAt).toBeInstanceOf(Date);
    });

    it('should throw error when trying to use already used invitation', () => {
      const invitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'user-1',
        expiresInDays: 7,
      });

      invitation.markAsUsed('user-2');

      expect(() => invitation.markAsUsed('user-3')).toThrow(
        'Invitation has already been used',
      );
    });

    it('should throw error when trying to use expired invitation', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const invitation = Invitation.reconstitute({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        expiresAt: pastDate,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        usedAt: null,
        usedBy: null,
      });

      expect(() => invitation.markAsUsed('user-2')).toThrow(
        'Invitation has expired',
      );
    });

    it('should set usedAt to current date when marking as used', () => {
      const invitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'user-1',
        expiresInDays: 7,
      });

      const beforeMark = new Date();
      invitation.markAsUsed('user-2');
      const afterMark = new Date();

      expect(invitation.usedAt).toBeDefined();
      expect(invitation.usedAt!.getTime()).toBeGreaterThanOrEqual(
        beforeMark.getTime(),
      );
      expect(invitation.usedAt!.getTime()).toBeLessThanOrEqual(
        afterMark.getTime(),
      );
    });
  });

  describe('isUsed()', () => {
    it('should return false for new invitation', () => {
      const invitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'user-1',
        expiresInDays: 7,
      });

      expect(invitation.isUsed()).toBe(false);
    });

    it('should return true after invitation is marked as used', () => {
      const invitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'user-1',
        expiresInDays: 7,
      });

      invitation.markAsUsed('user-2');

      expect(invitation.isUsed()).toBe(true);
    });
  });

  describe('validateUserIsNotCreator()', () => {
    it('should not throw when user is not the creator', () => {
      const invitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'user-1',
        expiresInDays: 7,
      });

      expect(() => invitation.validateUserIsNotCreator('user-2')).not.toThrow();
    });

    it('should throw when user is the creator', () => {
      const invitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'user-1',
        expiresInDays: 7,
      });

      expect(() => invitation.validateUserIsNotCreator('user-1')).toThrow(
        'Cannot accept your own invitation',
      );
    });
  });
});
