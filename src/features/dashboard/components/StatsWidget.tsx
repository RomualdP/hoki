import type { ReactNode } from "react";

interface StatsWidgetProps {
  readonly label: string;
  readonly value: string | number;
  readonly icon: ReactNode;
  readonly color?: "orange" | "blue" | "green" | "purple";
}

/**
 * StatsWidget - Atomic Component
 *
 * Widget pour afficher une statistique avec icône
 * Utilisé dans les dashboards pour afficher des métriques
 *
 * Mobile-first: Adaptatif sur petits écrans
 */
export function StatsWidget({
  label,
  value,
  icon,
  color = "orange",
}: StatsWidgetProps) {
  const colorClasses = {
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-xs sm:text-sm font-medium text-neutral-600">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-neutral-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
