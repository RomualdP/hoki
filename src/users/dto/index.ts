import { VolleyballSkill } from '../../types';

export class CreateUserDto {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password?: string;
  readonly role?: 'USER' | 'ADMIN';
  readonly avatar?: string;
}

export class UpdateUserDto {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatar?: string;
  readonly role?: 'USER' | 'ADMIN';
  readonly isActive?: boolean;
}

export class UpdateProfileDto {
  readonly biography?: string;
  readonly birthDate?: Date;
  readonly gender?: 'MALE' | 'FEMALE';
  readonly position?:
    | 'SETTER'
    | 'OUTSIDE_HITTER'
    | 'MIDDLE_BLOCKER'
    | 'OPPOSITE'
    | 'LIBERO'
    | 'DEFENSIVE_SPECIALIST';
  readonly height?: number;
  readonly weight?: number;
  readonly phoneNumber?: string;
  readonly city?: string;
  readonly country?: string;
  readonly preferredHand?: 'LEFT' | 'RIGHT' | 'AMBIDEXTROUS';
}

export class CreateUserSkillDto {
  readonly skillId: string;
  readonly level: number;
  readonly experienceYears?: number;
  readonly notes?: string;
}

export class UpdateUserSkillDto {
  readonly level?: number;
  readonly experienceYears?: number;
  readonly notes?: string;
}

export class QueryUsersDto {
  name?: string;
  email?: string;
  city?: string;
  position?: string;
  page?: number;
  limit?: number;
}

export class AddSkillDto {
  skill: VolleyballSkill;
  level: number;
  experienceYears?: number;
  notes?: string;
}

export class UpdateSkillDto {
  level?: number;
  experienceYears?: number;
  notes?: string;
}

export { UpdateUserAttributesDto } from './update-user-attributes.dto';
