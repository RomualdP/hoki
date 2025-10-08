import { UserAttribute, UserSkill } from '@prisma/client';
import { calculatePlayerLevel } from './player-level.helper';

describe('calculatePlayerLevel', () => {
  const createSkill = (level: number): UserSkill => ({
    id: 'skill-id',
    userId: 'user-id',
    skill: 'ATTACK',
    level,
    experienceYears: null,
    notes: null,
    assessedBy: null,
    assessedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const createAttribute = (
    attribute: 'FITNESS' | 'LEADERSHIP',
    value: number,
  ): UserAttribute => ({
    id: 'attr-id',
    userId: 'user-id',
    attribute,
    value,
    assessedBy: null,
    assessedAt: null,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it('should calculate player level with all skills and attributes', () => {
    const skills = [createSkill(5), createSkill(7), createSkill(6)];
    const attributes = [
      createAttribute('FITNESS', 1.2),
      createAttribute('LEADERSHIP', 1.5),
    ];

    const level = calculatePlayerLevel(skills, attributes);

    expect(level).toBe(32.4);
  });

  it('should return 0 when no skills are provided', () => {
    const skills: UserSkill[] = [];
    const attributes = [
      createAttribute('FITNESS', 1.2),
      createAttribute('LEADERSHIP', 1.5),
    ];

    const level = calculatePlayerLevel(skills, attributes);

    expect(level).toBe(0);
  });

  it('should use default coefficient of 1.0 when attributes are missing', () => {
    const skills = [createSkill(10)];
    const attributes: UserAttribute[] = [];

    const level = calculatePlayerLevel(skills, attributes);

    expect(level).toBe(10);
  });

  it('should use default coefficient when only FITNESS is missing', () => {
    const skills = [createSkill(8)];
    const attributes = [createAttribute('LEADERSHIP', 2.0)];

    const level = calculatePlayerLevel(skills, attributes);

    expect(level).toBe(16);
  });

  it('should use default coefficient when only LEADERSHIP is missing', () => {
    const skills = [createSkill(6)];
    const attributes = [createAttribute('FITNESS', 1.5)];

    const level = calculatePlayerLevel(skills, attributes);

    expect(level).toBe(9);
  });

  it('should calculate with multiple skills and standard coefficients', () => {
    const skills = [
      createSkill(8),
      createSkill(7),
      createSkill(9),
      createSkill(6),
      createSkill(7),
      createSkill(8),
    ];
    const attributes = [
      createAttribute('FITNESS', 1.0),
      createAttribute('LEADERSHIP', 1.0),
    ];

    const level = calculatePlayerLevel(skills, attributes);

    expect(level).toBe(45);
  });

  it('should handle decimal skill sum with decimal coefficients', () => {
    const skills = [createSkill(7), createSkill(8), createSkill(5)];
    const attributes = [
      createAttribute('FITNESS', 1.25),
      createAttribute('LEADERSHIP', 1.1),
    ];

    const level = calculatePlayerLevel(skills, attributes);

    expect(level).toBeCloseTo(27.5);
  });

  it('should return 0 when skills sum is 0', () => {
    const skills = [createSkill(0), createSkill(0)];
    const attributes = [
      createAttribute('FITNESS', 2.0),
      createAttribute('LEADERSHIP', 2.0),
    ];

    const level = calculatePlayerLevel(skills, attributes);

    expect(level).toBe(0);
  });
});
