import {
  DEFAULT_FITNESS_COEFFICIENT,
  DEFAULT_LEADERSHIP_COEFFICIENT,
  ATTRIBUTE_NAMES,
} from '../constants/player-level.constants';

export interface PlayerSkill {
  level: number;
}

export interface PlayerAttribute {
  attribute: string;
  value: number;
}

export class PlayerLevelCalculationService {
  calculateLevel(skills: PlayerSkill[], attributes: PlayerAttribute[]): number {
    const skillsSum = this.sumSkillLevels(skills);
    const fitnessCoefficient = this.extractFitnessCoefficient(attributes);
    const leadershipCoefficient = this.extractLeadershipCoefficient(attributes);

    return skillsSum * fitnessCoefficient * leadershipCoefficient;
  }

  private sumSkillLevels(skills: PlayerSkill[]): number {
    return skills.reduce((sum, skill) => sum + skill.level, 0);
  }

  private extractFitnessCoefficient(attributes: PlayerAttribute[]): number {
    return this.extractAttributeValue(
      attributes,
      ATTRIBUTE_NAMES.FITNESS,
      DEFAULT_FITNESS_COEFFICIENT,
    );
  }

  private extractLeadershipCoefficient(attributes: PlayerAttribute[]): number {
    return this.extractAttributeValue(
      attributes,
      ATTRIBUTE_NAMES.LEADERSHIP,
      DEFAULT_LEADERSHIP_COEFFICIENT,
    );
  }

  private extractAttributeValue(
    attributes: PlayerAttribute[],
    attributeName: string,
    defaultValue: number,
  ): number {
    const attribute = attributes.find(
      (attr) => attr.attribute === attributeName,
    );
    return attribute?.value ?? defaultValue;
  }
}
