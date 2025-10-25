import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

/**
 * PlayerSkillsSkeleton - Loading Skeleton
 *
 * Displays loading state for player skills
 */
export function PlayerSkillsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Évaluation des compétences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-4 border border-neutral-200 rounded-lg animate-pulse"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 bg-neutral-200 rounded w-24" />
                <div className="h-6 w-12 bg-neutral-200 rounded-full" />
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
