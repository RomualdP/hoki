export interface TeamMemberReadModel {
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  gender: string | null;
  level: number;
}

export interface TrainingTeamReadModel {
  id: string;
  trainingId: string;
  name: string;
  averageLevel: number;
  members: TeamMemberReadModel[];
  createdAt: Date;
}

export interface TrainingTeamListReadModel {
  id: string;
  name: string;
  averageLevel: number;
  memberCount: number;
  createdAt: Date;
}
