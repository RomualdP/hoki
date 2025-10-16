import { DomainException } from '../exceptions/domain.exception';

export type TrainingStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface TrainingProps {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: Date;
  duration: number;
  location: string | null;
  maxParticipants: number | null;
  status: TrainingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Training {
  private props: TrainingProps;

  constructor(props: TrainingProps) {
    this.validateInvariants(props);
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null {
    return this.props.description;
  }

  get scheduledAt(): Date {
    return this.props.scheduledAt;
  }

  get duration(): number {
    return this.props.duration;
  }

  get location(): string | null {
    return this.props.location;
  }

  get maxParticipants(): number | null {
    return this.props.maxParticipants;
  }

  get status(): TrainingStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isScheduled(): boolean {
    return this.props.status === 'SCHEDULED';
  }

  isInProgress(): boolean {
    return this.props.status === 'IN_PROGRESS';
  }

  isCompleted(): boolean {
    return this.props.status === 'COMPLETED';
  }

  isCancelled(): boolean {
    return this.props.status === 'CANCELLED';
  }

  canAcceptRegistrations(): boolean {
    return this.isScheduled() && this.scheduledAt > new Date();
  }

  hasAvailableSpots(currentParticipantsCount: number): boolean {
    if (this.maxParticipants === null) {
      return true;
    }
    return currentParticipantsCount < this.maxParticipants;
  }

  start(): void {
    if (!this.canStart()) {
      throw new DomainException(
        'Cannot start training: must be scheduled and not in the past',
      );
    }
    this.props.status = 'IN_PROGRESS';
    this.props.updatedAt = new Date();
  }

  complete(): void {
    if (!this.canComplete()) {
      throw new DomainException(
        'Cannot complete training: must be in progress',
      );
    }
    this.props.status = 'COMPLETED';
    this.props.updatedAt = new Date();
  }

  cancel(): void {
    if (this.isCompleted()) {
      throw new DomainException('Cannot cancel a completed training');
    }
    this.props.status = 'CANCELLED';
    this.props.updatedAt = new Date();
  }

  reschedule(newDate: Date): void {
    if (!this.canReschedule()) {
      throw new DomainException(
        'Cannot reschedule: training already completed or cancelled',
      );
    }
    if (newDate <= new Date()) {
      throw new DomainException('Cannot schedule in the past');
    }
    this.props.scheduledAt = newDate;
    this.props.updatedAt = new Date();
  }

  updateDetails(data: {
    title?: string;
    description?: string;
    duration?: number;
    location?: string;
    maxParticipants?: number;
  }): void {
    if (this.isCompleted() || this.isCancelled()) {
      throw new DomainException(
        'Cannot update completed or cancelled training',
      );
    }

    if (data.title !== undefined) {
      if (data.title.trim().length < 3) {
        throw new DomainException('Title must be at least 3 characters');
      }
      this.props.title = data.title;
    }

    if (data.description !== undefined) {
      this.props.description = data.description;
    }

    if (data.duration !== undefined) {
      if (data.duration < 30 || data.duration > 300) {
        throw new DomainException(
          'Duration must be between 30 and 300 minutes',
        );
      }
      this.props.duration = data.duration;
    }

    if (data.location !== undefined) {
      this.props.location = data.location;
    }

    if (data.maxParticipants !== undefined) {
      if (data.maxParticipants !== null && data.maxParticipants < 1) {
        throw new DomainException('Max participants must be at least 1');
      }
      this.props.maxParticipants = data.maxParticipants;
    }

    this.props.updatedAt = new Date();
  }

  private canStart(): boolean {
    return this.isScheduled() && this.scheduledAt <= new Date();
  }

  private canComplete(): boolean {
    return this.isInProgress();
  }

  private canReschedule(): boolean {
    return this.isScheduled() || this.isInProgress();
  }

  private validateInvariants(props: TrainingProps): void {
    if (!props.title || props.title.trim().length < 3) {
      throw new DomainException('Training title must be at least 3 characters');
    }
    if (props.duration < 30 || props.duration > 300) {
      throw new DomainException(
        'Training duration must be between 30 and 300 minutes',
      );
    }
    if (props.maxParticipants !== null && props.maxParticipants < 1) {
      throw new DomainException('Max participants must be at least 1');
    }
  }
}
