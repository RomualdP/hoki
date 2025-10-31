export type VolleyballSkill = 
  | 'ATTACK' 
  | 'DEFENSE' 
  | 'SERVING' 
  | 'RECEPTION' 
  | 'SETTING' 
  | 'BLOCKING';

export interface SkillDefinition {
  readonly skill: VolleyballSkill;
  readonly name: string;
  readonly description: string;
}

export type SkillLevel = number; // 1 to 10

export interface UserSkill {
  readonly id: string;
  readonly userId: string;
  readonly skill: VolleyballSkill;
  readonly level: number;
  readonly experienceYears?: number;
  readonly notes?: string;
  readonly assessedBy?: string;
  readonly assessedAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface UserSkillCreateData {
  readonly skill: VolleyballSkill;
  readonly level: number;
  readonly experienceYears?: number;
  readonly notes?: string;
}

export interface UserSkillUpdateData {
  readonly level?: number;
  readonly experienceYears?: number;
  readonly notes?: string;
} 