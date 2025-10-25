import { getUserSkills } from "@/features/users/api/users.server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { getAllSkillDefinitions } from "@/constants/volleyball-skills";
import type { UserSkill, VolleyballSkill } from "@/types";

/**
 * PlayerSkillsServer - Server Component
 *
 * Fetches user skills server-side and displays them
 * TODO: Can be extended with editing capabilities using Server Actions
 */

interface PlayerSkillsServerProps {
  readonly userId: string;
}

export async function PlayerSkillsServer({ userId }: PlayerSkillsServerProps) {
  const userSkills = await getUserSkills(userId);
  const skillDefinitions = getAllSkillDefinitions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évaluation des compétences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {skillDefinitions.map((skillDef) => {
            const userSkill = userSkills.find(
              (us) => us.skill === skillDef.skill,
            );
            return (
              <SkillDisplay
                key={skillDef.skill}
                skill={skillDef.skill}
                skillName={skillDef.name}
                level={userSkill?.level || 0}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface SkillDisplayProps {
  readonly skill: VolleyballSkill;
  readonly skillName: string;
  readonly level: number;
}

function SkillDisplay({ skillName, level }: SkillDisplayProps) {
  return (
    <div className="p-4 border border-neutral-200 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-neutral-900">
          {skillName}
        </span>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getRatingColor(level)}`}
        >
          {level}/10
        </span>
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
