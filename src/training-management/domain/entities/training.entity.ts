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
  private readonly props: TrainingProps;

  constructor(props: TrainingProps) {
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
}
