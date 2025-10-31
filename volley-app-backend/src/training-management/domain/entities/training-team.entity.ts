import { DomainException } from '../exceptions/domain.exception';
import { TeamSize } from '../value-objects/team-size.value-object';

export interface TrainingTeamProps {
  id: string;
  trainingId: string;
  name: string;
  memberIds: string[];
  averageLevel: number;
  createdAt: Date;
}

export class TrainingTeam {
  private props: TrainingTeamProps;

  constructor(props: TrainingTeamProps) {
    this.validateInvariants(props);
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get trainingId(): string {
    return this.props.trainingId;
  }

  get name(): string {
    return this.props.name;
  }

  get memberIds(): string[] {
    return [...this.props.memberIds];
  }

  get averageLevel(): number {
    return this.props.averageLevel;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  getSize(): number {
    return this.props.memberIds.length;
  }

  isEmpty(): boolean {
    return TeamSize.isEmpty(this.getSize());
  }

  isFull(): boolean {
    return TeamSize.isFull(this.getSize());
  }

  canAddMember(): boolean {
    return TeamSize.canAddMember(this.getSize());
  }

  isValidSize(): boolean {
    return TeamSize.isValid(this.getSize());
  }

  hasMember(userId: string): boolean {
    return this.props.memberIds.includes(userId);
  }

  addMember(userId: string, memberLevel: number): void {
    if (!this.canAddMember()) {
      throw new DomainException('Team is full (max 6 players)');
    }

    if (this.hasMember(userId)) {
      throw new DomainException('User is already in this team');
    }

    this.props.memberIds.push(userId);
    this.recalculateAverageLevel(memberLevel);
  }

  removeMember(userId: string, memberLevel: number): void {
    if (!this.hasMember(userId)) {
      throw new DomainException('User is not in this team');
    }

    if (this.isEmpty()) {
      throw new DomainException('Cannot remove from empty team');
    }

    this.props.memberIds = this.props.memberIds.filter((id) => id !== userId);
    this.recalculateAverageLevelAfterRemoval(memberLevel);
  }

  rename(newName: string): void {
    if (!newName || newName.trim().length < 2) {
      throw new DomainException('Team name must be at least 2 characters');
    }
    this.props.name = newName.trim();
  }

  private recalculateAverageLevel(newMemberLevel: number): void {
    const currentSum = this.props.averageLevel * (this.getSize() - 1);
    this.props.averageLevel = (currentSum + newMemberLevel) / this.getSize();
  }

  private recalculateAverageLevelAfterRemoval(
    removedMemberLevel: number,
  ): void {
    if (this.isEmpty()) {
      this.props.averageLevel = 0;
      return;
    }
    const currentSum = this.props.averageLevel * (this.getSize() + 1);
    this.props.averageLevel =
      (currentSum - removedMemberLevel) / this.getSize();
  }

  private validateInvariants(props: TrainingTeamProps): void {
    if (!TeamSize.isValid(props.memberIds.length)) {
      throw new DomainException(
        `Team size must be between ${TeamSize.min} and ${TeamSize.max}`,
      );
    }
  }
}
