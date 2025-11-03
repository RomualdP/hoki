import { DomainException } from '../exceptions/domain.exception';

export interface TrainingTemplateProps {
  id: string;
  clubId: string;
  title: string;
  description: string | null;
  duration: number;
  location: string | null;
  maxParticipants: number | null;
  dayOfWeek: number;
  time: string;
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
    return this.props.teamIds;
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

  updateDetails(data: {
    title?: string;
    description?: string;
    duration?: number;
    location?: string;
    maxParticipants?: number;
    dayOfWeek?: number;
    time?: string;
    teamIds?: string[];
  }): void {
    if (data.title !== undefined) {
      this.validateTitle(data.title);
      this.props.title = data.title;
    }

    if (data.description !== undefined) {
      this.props.description = data.description;
    }

    if (data.duration !== undefined) {
      this.validateDuration(data.duration);
      this.props.duration = data.duration;
    }

    if (data.location !== undefined) {
      this.props.location = data.location;
    }

    if (data.maxParticipants !== undefined) {
      this.validateMaxParticipants(data.maxParticipants);
      this.props.maxParticipants = data.maxParticipants;
    }

    if (data.dayOfWeek !== undefined) {
      this.validateDayOfWeek(data.dayOfWeek);
      this.props.dayOfWeek = data.dayOfWeek;
    }

    if (data.time !== undefined) {
      this.validateTime(data.time);
      this.props.time = data.time;
    }

    if (data.teamIds !== undefined) {
      this.props.teamIds = data.teamIds;
    }

    this.props.updatedAt = new Date();
  }

  calculateNextScheduledDate(fromDate: Date = new Date()): Date {
    const nextDate = new Date(fromDate);
    nextDate.setDate(nextDate.getDate() + (7 - nextDate.getDay()) + 7);
    nextDate.setDate(nextDate.getDate() + this.dayOfWeek);
    const [hours, minutes] = this.time.split(':').map(Number);
    nextDate.setHours(hours, minutes, 0, 0);
    return nextDate;
  }

  private validateInvariants(props: TrainingTemplateProps): void {
    this.validateTitle(props.title);
    this.validateDuration(props.duration);
    this.validateMaxParticipants(props.maxParticipants);
    this.validateDayOfWeek(props.dayOfWeek);
    this.validateTime(props.time);
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length < 3) {
      throw new DomainException('Template title must be at least 3 characters');
    }
  }

  private validateDuration(duration: number): void {
    if (duration < 30 || duration > 300) {
      throw new DomainException('Duration must be between 30 and 300 minutes');
    }
  }

  private validateMaxParticipants(maxParticipants: number | null): void {
    if (maxParticipants !== null && maxParticipants < 1) {
      throw new DomainException('Max participants must be at least 1');
    }
  }

  private validateDayOfWeek(dayOfWeek: number): void {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new DomainException('Day of week must be between 0 and 6');
    }
  }

  private validateTime(time: string): void {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      throw new DomainException('Time must be in HH:mm format');
    }
  }
}
