import { DomainException } from '../exceptions/domain.exception';

export type RegistrationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'WAITLIST';

export interface TrainingRegistrationProps {
  id: string;
  trainingId: string;
  userId: string;
  status: RegistrationStatus;
  registeredAt: Date;
  cancelledAt: Date | null;
}

export class TrainingRegistration {
  private props: TrainingRegistrationProps;

  constructor(props: TrainingRegistrationProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get trainingId(): string {
    return this.props.trainingId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get status(): RegistrationStatus {
    return this.props.status;
  }

  get registeredAt(): Date {
    return this.props.registeredAt;
  }

  get cancelledAt(): Date | null {
    return this.props.cancelledAt;
  }

  isPending(): boolean {
    return this.props.status === 'PENDING';
  }

  isConfirmed(): boolean {
    return this.props.status === 'CONFIRMED';
  }

  isCancelled(): boolean {
    return this.props.status === 'CANCELLED';
  }

  isOnWaitlist(): boolean {
    return this.props.status === 'WAITLIST';
  }

  canBeCancelled(): boolean {
    return this.isConfirmed() || this.isPending() || this.isOnWaitlist();
  }

  isActive(): boolean {
    return this.isConfirmed() || this.isPending() || this.isOnWaitlist();
  }

  confirm(): void {
    if (!this.canBeConfirmed()) {
      throw new DomainException(
        'Cannot confirm: registration must be pending or on waitlist',
      );
    }
    this.props.status = 'CONFIRMED';
  }

  cancel(): void {
    if (!this.canBeCancelled()) {
      throw new DomainException('Cannot cancel: registration is not active');
    }
    this.props.status = 'CANCELLED';
    this.props.cancelledAt = new Date();
  }

  moveToWaitlist(): void {
    if (!this.isPending()) {
      throw new DomainException(
        'Only pending registrations can be moved to waitlist',
      );
    }
    this.props.status = 'WAITLIST';
  }

  private canBeConfirmed(): boolean {
    return this.isPending() || this.isOnWaitlist();
  }
}
