"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

const updateSkillSchema = z.object({
  userId: z.string().min(1),
  skillName: z.string().min(1),
  level: z.number().int().min(1).max(10),
});

export async function updateUserSkillAction(
  userId: string,
  skillName: string,
  level: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = updateSkillSchema.parse({ userId, skillName, level });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const url = `${apiUrl}/users/${validated.userId}/skills/${validated.skillName}`;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify({ level: validated.level }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to update skill",
      };
    }

    revalidatePath(`/players/${validated.userId}`);
    revalidatePath("/players");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Invalid data: ${error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
