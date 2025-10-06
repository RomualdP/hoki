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
  private readonly props: TrainingTeamProps;

  constructor(props: TrainingTeamProps) {
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
}
