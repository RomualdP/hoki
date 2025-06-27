import { Prisma } from '@prisma/client';

export type UserWhereInput = Prisma.UserWhereInput;
export type MatchWhereInput = Prisma.MatchWhereInput;
export type NewsWhereInput = Prisma.NewsWhereInput;
export type ActivityWhereInput = Prisma.ActivityWhereInput;
export type TeamWhereInput = Prisma.TeamWhereInput;
export type SkillWhereInput = Prisma.SkillWhereInput;
export type TournamentWhereInput = Prisma.TournamentWhereInput;
export type NotificationWhereInput = Prisma.NotificationWhereInput;

export type DateFilter = {
  gte?: Date;
  lte?: Date;
};

export type TeamMemberData = {
  userId: string;
  role: 'CAPTAIN' | 'VICE_CAPTAIN' | 'MEMBER';
  joinedAt?: Date;
};

export type CommentData = {
  content: string;
  authorId: string;
};

export type MatchEventData = {
  eventType:
    | 'POINT_SCORED'
    | 'ACE'
    | 'BLOCK'
    | 'ERROR'
    | 'SUBSTITUTION'
    | 'TIMEOUT'
    | 'SET_WON';
  playerId?: string;
  teamId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

export type MatchParticipantData = {
  userId: string;
  teamId?: string;
  confirmed?: boolean;
};

export type NewsInteractionData = {
  type: 'LIKE' | 'VIEW' | 'SHARE';
  userId: string;
};
