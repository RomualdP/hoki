import {
  PlayerLevelCalculationService,
  PlayerSkill,
  PlayerAttribute,
} from './player-level-calculation.service';
import {
  DEFAULT_FITNESS_COEFFICIENT,
  DEFAULT_LEADERSHIP_COEFFICIENT,
} from '../constants/player-level.constants';

describe('PlayerLevelCalculationService', () => {
  let service: PlayerLevelCalculationService;

  beforeEach(() => {
    service = new PlayerLevelCalculationService();
  });

  describe('calculateLevel', () => {
    it('should calculate level with only skills and no attributes', () => {
      const skills: PlayerSkill[] = [{ level: 5 }, { level: 3 }, { level: 2 }];
      const attributes: PlayerAttribute[] = [];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(10);
    });

    it('should apply default coefficients when attributes are empty', () => {
      const skills: PlayerSkill[] = [{ level: 8 }];
      const attributes: PlayerAttribute[] = [];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(
        8 * DEFAULT_FITNESS_COEFFICIENT * DEFAULT_LEADERSHIP_COEFFICIENT,
      );
    });

    it('should apply fitness coefficient correctly', () => {
      const skills: PlayerSkill[] = [{ level: 10 }];
      const attributes: PlayerAttribute[] = [
        { attribute: 'FITNESS', value: 1.5 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(15);
    });

    it('should apply leadership coefficient correctly', () => {
      const skills: PlayerSkill[] = [{ level: 10 }];
      const attributes: PlayerAttribute[] = [
        { attribute: 'LEADERSHIP', value: 2.0 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(20);
    });

    it('should apply both fitness and leadership coefficients', () => {
      const skills: PlayerSkill[] = [{ level: 10 }];
      const attributes: PlayerAttribute[] = [
        { attribute: 'FITNESS', value: 1.5 },
        { attribute: 'LEADERSHIP', value: 2.0 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(30);
    });

    it('should calculate level with multiple skills and coefficients', () => {
      const skills: PlayerSkill[] = [{ level: 5 }, { level: 4 }, { level: 3 }];
      const attributes: PlayerAttribute[] = [
        { attribute: 'FITNESS', value: 1.2 },
        { attribute: 'LEADERSHIP', value: 1.5 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBeCloseTo(21.6, 10);
    });

    it('should ignore unknown attributes', () => {
      const skills: PlayerSkill[] = [{ level: 5 }];
      const attributes: PlayerAttribute[] = [
        { attribute: 'UNKNOWN', value: 999 },
        { attribute: 'ANOTHER_UNKNOWN', value: 500 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(5);
    });

    it('should handle mixed known and unknown attributes', () => {
      const skills: PlayerSkill[] = [{ level: 10 }];
      const attributes: PlayerAttribute[] = [
        { attribute: 'FITNESS', value: 2.0 },
        { attribute: 'UNKNOWN', value: 999 },
        { attribute: 'LEADERSHIP', value: 1.5 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(30);
    });

    it('should return zero when skills array is empty', () => {
      const skills: PlayerSkill[] = [];
      const attributes: PlayerAttribute[] = [
        { attribute: 'FITNESS', value: 2.0 },
        { attribute: 'LEADERSHIP', value: 1.5 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(0);
    });

    it('should handle zero skill levels', () => {
      const skills: PlayerSkill[] = [{ level: 0 }, { level: 0 }];
      const attributes: PlayerAttribute[] = [
        { attribute: 'FITNESS', value: 1.5 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(0);
    });

    it('should handle coefficient value of zero', () => {
      const skills: PlayerSkill[] = [{ level: 10 }];
      const attributes: PlayerAttribute[] = [
        { attribute: 'FITNESS', value: 0 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(0);
    });

    it('should handle real-world scenario with mixed data', () => {
      const skills: PlayerSkill[] = [
        { level: 7 },
        { level: 6 },
        { level: 8 },
        { level: 5 },
      ];
      const attributes: PlayerAttribute[] = [
        { attribute: 'FITNESS', value: 1.1 },
        { attribute: 'LEADERSHIP', value: 1.2 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(34.32);
    });

    it('should use default fitness coefficient when fitness attribute is missing', () => {
      const skills: PlayerSkill[] = [{ level: 10 }];
      const attributes: PlayerAttribute[] = [
        { attribute: 'LEADERSHIP', value: 2.0 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(20);
    });

    it('should use default leadership coefficient when leadership attribute is missing', () => {
      const skills: PlayerSkill[] = [{ level: 10 }];
      const attributes: PlayerAttribute[] = [
        { attribute: 'FITNESS', value: 1.5 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(15);
    });

    it('should handle duplicate attributes by using first occurrence', () => {
      const skills: PlayerSkill[] = [{ level: 10 }];
      const attributes: PlayerAttribute[] = [
        { attribute: 'FITNESS', value: 2.0 },
        { attribute: 'FITNESS', value: 1.5 },
      ];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(20);
    });

    it('should calculate correctly with fractional skill levels', () => {
      const skills: PlayerSkill[] = [{ level: 5.5 }, { level: 4.5 }];
      const attributes: PlayerAttribute[] = [];

      const level = service.calculateLevel(skills, attributes);

      expect(level).toBe(10);
    });
  });
});
