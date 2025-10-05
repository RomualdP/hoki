'use client';

import type { VolleyballSkill } from '../../types';
import { SKILL_LEVEL_OPTIONS } from '../../constants/skills';
import { VOLLEYBALL_SKILL_DEFINITIONS } from '../../constants/volleyball-skills';

interface SkillLevelCardProps {
  readonly skill: VolleyballSkill;
  readonly currentLevel: number;
  readonly isEditing: boolean;
  readonly onEdit: () => void;
  readonly onCancel: () => void;
  readonly onLevelChange: (level: number) => void;
  readonly getRatingLabel: (rating: number) => string;
  readonly getRatingColor: (rating: number) => string;
}

export function SkillLevelCard({
  skill,
  currentLevel,
  isEditing,
  onEdit,
  onCancel,
  onLevelChange,
  getRatingLabel,
  getRatingColor,
}: SkillLevelCardProps) {
  const levelOptions = SKILL_LEVEL_OPTIONS;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow w-full">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <p className="font-medium text-gray-900">{VOLLEYBALL_SKILL_DEFINITIONS[skill].name}</p>
          {VOLLEYBALL_SKILL_DEFINITIONS[skill].description && (
            <p className="text-xs text-gray-500 mt-1">{VOLLEYBALL_SKILL_DEFINITIONS[skill].description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <select
                value={currentLevel.toString()}
                onChange={(e) => onLevelChange(parseInt(e.target.value, 10))}
                className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(currentLevel)}`}>
                {currentLevel === 0 ? 'Non évalué' : getRatingLabel(currentLevel)}
              </span>
              <button
                onClick={onEdit}
                className="text-gray-400 hover:text-gray-600 text-sm"
                title="Modifier le niveau"
              >
                ✏️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
