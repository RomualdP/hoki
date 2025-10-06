export type Gender = 'MALE' | 'FEMALE';

export interface ParticipantWithLevelProps {
  userId: string;
  gender: Gender | null;
  level: number;
}

export class ParticipantWithLevel {
  private readonly props: ParticipantWithLevelProps;

  constructor(props: ParticipantWithLevelProps) {
    this.props = props;
  }

  get userId(): string {
    return this.props.userId;
  }

  get gender(): Gender | null {
    return this.props.gender;
  }

  get level(): number {
    return this.props.level;
  }

  hasGender(): boolean {
    return this.props.gender !== null;
  }

  isFemale(): boolean {
    return this.props.gender === 'FEMALE';
  }

  isMale(): boolean {
    return this.props.gender === 'MALE';
  }
}
