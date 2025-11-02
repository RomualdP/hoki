import { getUserSkills } from "@/features/users/api/users.server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { getAllSkillDefinitions } from "@/constants/volleyball-skills";
import { updateUserSkillAction } from "@/features/users/actions/skills.actions";
import { PlayerSkillsClient } from "./components/PlayerSkillsClient";

/**
 * PlayerSkillsServer - Server Component
 *
 * Fetches user skills server-side and delegates editing to Client Component
 * Uses Server Actions for mutations with optimistic updates
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
        <PlayerSkillsClient
          userId={userId}
          skills={userSkills}
          skillDefinitions={skillDefinitions}
          updateSkillAction={updateUserSkillAction}
        />
      </CardContent>
    </Card>
  );
}
