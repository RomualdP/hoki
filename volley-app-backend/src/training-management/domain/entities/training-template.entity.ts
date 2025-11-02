import { DomainException } from '../exceptions/domain.exception';

export interface TrainingTemplateProps {
  id: string;
  clubId: string;
  title: string;
  description: string | null;
  duration: number;
  location: string | null;
  maxParticipants: number | null;
  dayOfWeek: number; // 0 = lundi, 6 = dimanche
  time: string; // Format HH:mm
  isActive: boolean;
  teamIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class TrainingTemplate {
  private props: TrainingTemplateProps;

  constructor(props: TrainingTemplateProps) {
    this.validateInvariants(props);
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get clubId(): string {
    return this.props.clubId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null {
    return this.props.description;
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

  get dayOfWeek(): number {
    return this.props.dayOfWeek;
  }

  get time(): string {
    return this.props.time;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get teamIds(): string[] {
    return [...this.props.teamIds];
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  toggle(): void {
    this.props.isActive = !this.props.isActive;
    this.props.updatedAt = new Date();
  }

  update(data: {
    title?: string;
    description?: string | null;
    duration?: number;
    location?: string | null;
    maxParticipants?: number | null;
    dayOfWeek?: number;
    time?: string;
    teamIds?: string[];
  }): void {
    if (data.title !== undefined) {
      if (data.title.trim().length < 3) {
        throw new DomainException(
          'Training template title must be at least 3 characters',
        );
      }
      this.props.title = data.title;
    }

    if (data.description !== undefined) {
      this.props.description = data.description;
    }

    if (data.duration !== undefined) {
      if (data.duration < 30 || data.duration > 300) {
        throw new DomainException(
          'Training template duration must be between 30 and 300 minutes',
        );
      }
      this.props.duration = data.duration;
    }

    if (data.location !== undefined) {
      this.props.location = data.location;
    }

    if (data.maxParticipants !== undefined) {
      if (data.maxParticipants !== null && data.maxParticipants < 1) {
        throw new DomainException(
          'Training template max participants must be at least 1',
        );
      }
      this.props.maxParticipants = data.maxParticipants;
    }

    if (data.dayOfWeek !== undefined) {
      if (data.dayOfWeek < 0 || data.dayOfWeek > 6) {
        throw new DomainException(
          'Training template dayOfWeek must be between 0 (Monday) and 6 (Sunday)',
        );
      }
      this.props.dayOfWeek = data.dayOfWeek;
    }

    if (data.time !== undefined) {
      if (!this.isValidTimeFormat(data.time)) {
        throw new DomainException(
          'Training template time must be in HH:mm format',
        );
      }
      this.props.time = data.time;
    }

    if (data.teamIds !== undefined) {
      this.props.teamIds = [...data.teamIds];
    }

    this.props.updatedAt = new Date();
  }

  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  }

  private validateInvariants(props: TrainingTemplateProps): void {
    if (!props.title || props.title.trim().length < 3) {
      throw new DomainException(
        'Training template title must be at least 3 characters',
      );
    }
    if (props.duration < 30 || props.duration > 300) {
      throw new DomainException(
        'Training template duration must be between 30 and 300 minutes',
      );
    }
    if (props.maxParticipants !== null && props.maxParticipants < 1) {
      throw new DomainException(
        'Training template max participants must be at least 1',
      );
    }
    if (props.dayOfWeek < 0 || props.dayOfWeek > 6) {
      throw new DomainException(
        'Training template dayOfWeek must be between 0 (Monday) and 6 (Sunday)',
      );
    }
    if (!this.isValidTimeFormat(props.time)) {
      throw new DomainException(
        'Training template time must be in HH:mm format',
      );
    }
  }
}

