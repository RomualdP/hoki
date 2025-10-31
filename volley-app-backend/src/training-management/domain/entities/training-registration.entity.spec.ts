import { TrainingRegistration } from './training-registration.entity';
import { DomainException } from '../exceptions/domain.exception';

describe('TrainingRegistration Entity', () => {
  const createValidRegistrationProps = (overrides = {}) => ({
    id: 'registration-1',
    trainingId: 'training-1',
    userId: 'user-1',
    status: 'CONFIRMED' as const,
    registeredAt: new Date(),
    cancelledAt: null,
    ...overrides,
  });

  describe('canBeCancelled', () => {
    it('should return true when status is CONFIRMED', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'CONFIRMED',
        }),
      );

      expect(registration.canBeCancelled()).toBe(true);
    });

    it('should return true when status is PENDING', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'PENDING',
        }),
      );

      expect(registration.canBeCancelled()).toBe(true);
    });

    it('should return true when status is WAITLIST', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'WAITLIST',
        }),
      );

      expect(registration.canBeCancelled()).toBe(true);
    });

    it('should return false when status is CANCELLED', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'CANCELLED',
          cancelledAt: new Date(),
        }),
      );

      expect(registration.canBeCancelled()).toBe(false);
    });
  });

  describe('isActive', () => {
    it('should return true when status is CONFIRMED', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'CONFIRMED',
        }),
      );

      expect(registration.isActive()).toBe(true);
    });

    it('should return true when status is PENDING', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'PENDING',
        }),
      );

      expect(registration.isActive()).toBe(true);
    });

    it('should return true when status is WAITLIST', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'WAITLIST',
        }),
      );

      expect(registration.isActive()).toBe(true);
    });

    it('should return false when status is CANCELLED', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'CANCELLED',
          cancelledAt: new Date(),
        }),
      );

      expect(registration.isActive()).toBe(false);
    });
  });

  describe('cancel', () => {
    it('should cancel a CONFIRMED registration', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'CONFIRMED',
        }),
      );

      registration.cancel();

      expect(registration.isCancelled()).toBe(true);
      expect(registration.cancelledAt).not.toBeNull();
    });

    it('should cancel a PENDING registration', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'PENDING',
        }),
      );

      registration.cancel();

      expect(registration.isCancelled()).toBe(true);
    });

    it('should cancel a WAITLIST registration', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'WAITLIST',
        }),
      );

      registration.cancel();

      expect(registration.isCancelled()).toBe(true);
    });

    it('should throw when trying to cancel an already CANCELLED registration', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'CANCELLED',
          cancelledAt: new Date(),
        }),
      );

      expect(() => registration.cancel()).toThrow(DomainException);
      expect(() => registration.cancel()).toThrow(
        'Cannot cancel: registration is not active',
      );
    });
  });

  describe('confirm', () => {
    it('should confirm a PENDING registration', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'PENDING',
        }),
      );

      registration.confirm();

      expect(registration.isConfirmed()).toBe(true);
    });

    it('should confirm a WAITLIST registration', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'WAITLIST',
        }),
      );

      registration.confirm();

      expect(registration.isConfirmed()).toBe(true);
    });

    it('should throw when trying to confirm an already CONFIRMED registration', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'CONFIRMED',
        }),
      );

      expect(() => registration.confirm()).toThrow(DomainException);
      expect(() => registration.confirm()).toThrow(
        'Cannot confirm: registration must be pending or on waitlist',
      );
    });

    it('should throw when trying to confirm a CANCELLED registration', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'CANCELLED',
          cancelledAt: new Date(),
        }),
      );

      expect(() => registration.confirm()).toThrow(DomainException);
    });
  });

  describe('moveToWaitlist', () => {
    it('should move a PENDING registration to WAITLIST', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'PENDING',
        }),
      );

      registration.moveToWaitlist();

      expect(registration.isOnWaitlist()).toBe(true);
    });

    it('should throw when trying to move non-PENDING registration to waitlist', () => {
      const registration = new TrainingRegistration(
        createValidRegistrationProps({
          status: 'CONFIRMED',
        }),
      );

      expect(() => registration.moveToWaitlist()).toThrow(DomainException);
      expect(() => registration.moveToWaitlist()).toThrow(
        'Only pending registrations can be moved to waitlist',
      );
    });
  });
});
