'use client';

import type { Skill, SkillCategory } from '../../types';
import { SkillLevelCard } from './SkillLevelCard';

const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  ATTACK: 'Attaque',
  DEFENSE: 'Défense',
  SERVING: 'Service',
  RECEPTION: 'Réception',
  SETTING: 'Passe',
  BLOCKING: 'Contre',
  TEAMWORK: 'Esprit d\'équipe',
  LEADERSHIP: 'Leadership',
};

interface SkillCategorySectionProps {
  readonly category: SkillCategory;
  readonly skills: Skill[];
  readonly editingSkillId: string | null;
  readonly getUserSkillLevel: (skillId: string) => number;
  readonly onEditSkill: (skillId: string | null) => void;
  readonly onSkillLevelChange: (skillId: string, level: number) => void;
  readonly getRatingLabel: (rating: number) => string;
  readonly getRatingColor: (rating: number) => string;
}

export function SkillCategorySection({
  category,
  skills,
  editingSkillId,
  getUserSkillLevel,
  onEditSkill,
  onSkillLevelChange,
  getRatingLabel,
  getRatingColor,
}: SkillCategorySectionProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
        {SKILL_CATEGORY_LABELS[category]}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <SkillLevelCard
            key={skill.id}
            skill={skill}
            currentLevel={getUserSkillLevel(skill.id)}
            isEditing={editingSkillId === skill.id}
            onEdit={() => onEditSkill(skill.id)}
            onCancel={() => onEditSkill(null)}
            onLevelChange={(level) => onSkillLevelChange(skill.id, level)}
            getRatingLabel={getRatingLabel}
            getRatingColor={getRatingColor}
          />
        ))}
      </div>
    </div>
  );
}
