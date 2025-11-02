"use client";

import { useOptimistic, useState, useTransition } from "react";
import { SKILL_RATING_OPTIONS_SIMPLE } from "@/constants/skills";
import type { VolleyballSkill, UserSkill, SkillDefinition } from "@/types";

interface PlayerSkillsClientProps {
  readonly userId: string;
  readonly skills: UserSkill[];
  readonly skillDefinitions: SkillDefinition[];
  readonly updateSkillAction: (
    userId: string,
    skillName: string,
    level: number,
  ) => Promise<{ success: boolean; error?: string }>;
}

export function PlayerSkillsClient({
  userId,
  skills,
  skillDefinitions,
  updateSkillAction,
}: PlayerSkillsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticSkills, updateOptimisticSkills] = useOptimistic(
    skills,
    (state, { skill, level }: { skill: VolleyballSkill; level: number }) =>
      state.map((s) => (s.skill === skill ? { ...s, level } : s)),
  );

  const [editingSkill, setEditingSkill] = useState<VolleyballSkill | null>(
    null,
  );

  const handleLevelClick = (skill: VolleyballSkill) => {
    setEditingSkill(skill);
  };

  const handleLevelChange = async (
    skill: VolleyballSkill,
    newLevel: number,
  ) => {
    setEditingSkill(null);

    startTransition(async () => {
      updateOptimisticSkills({ skill, level: newLevel });

      const result = await updateSkillAction(userId, skill, newLevel);

      if (!result.success) {
        console.error("Failed to update skill:", result.error);
      }
    });
  };

  const handleBlur = () => {
    setEditingSkill(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {skillDefinitions.map((skillDef) => {
        const userSkill = optimisticSkills.find(
          (us) => us.skill === skillDef.skill,
        );
        const level = userSkill?.level || 0;
        const isEditing = editingSkill === skillDef.skill;

        return (
          <SkillCard
            key={skillDef.skill}
            skill={skillDef.skill}
            skillName={skillDef.name}
            level={level}
            isEditing={isEditing}
            onLevelClick={handleLevelClick}
            onLevelChange={handleLevelChange}
            onBlur={handleBlur}
          />
        );
      })}
    </div>
  );
}

interface SkillCardProps {
  readonly skill: VolleyballSkill;
  readonly skillName: string;
  readonly level: number;
  readonly isEditing: boolean;
  readonly onLevelClick: (skill: VolleyballSkill) => void;
  readonly onLevelChange: (skill: VolleyballSkill, level: number) => void;
  readonly onBlur: () => void;
}

function SkillCard({
  skill,
  skillName,
  level,
  isEditing,
  onLevelClick,
  onLevelChange,
  onBlur,
}: SkillCardProps) {
  return (
    <div className="p-4 border border-neutral-200 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-neutral-900">
          {skillName}
        </span>
        {isEditing ? (
          <select
            value={level.toString()}
            onChange={(e) => {
              const newLevel = parseInt(e.target.value, 10);
              onLevelChange(skill, newLevel);
            }}
            onBlur={onBlur}
            autoFocus
            className="px-2 py-1 text-xs font-medium rounded-full border border-neutral-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          >
            {SKILL_RATING_OPTIONS_SIMPLE.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <button
            onClick={() => onLevelClick(skill)}
            className={`px-2 py-1 text-xs font-medium rounded-full ${getRatingColor(level)} cursor-pointer hover:ring-2 hover:ring-orange-300`}
            type="button"
          >
            {level}/10
          </button>
        )}
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div
          className="bg-orange-500 h-2 rounded-full transition-all"
          style={{ width: `${(level / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}

function getRatingColor(rating: number): string {
  if (rating >= 9) return "bg-green-100 text-green-800";
  if (rating >= 7) return "bg-orange-100 text-orange-800";
  if (rating >= 5) return "bg-blue-100 text-blue-800";
  if (rating >= 3) return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
}
