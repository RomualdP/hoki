import type { ReactNode } from "react";

interface DashboardCardProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
}

/**
 * DashboardCard - Atomic Component
 *
 * Wrapper réutilisable pour les widgets du dashboard
 * Affiche un titre, du contenu et optionnellement une action (bouton)
 *
 * Mobile-first: padding adaptatif, responsive
 */
export function DashboardCard({
  title,
  children,
  action,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-neutral-200 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-b border-neutral-200">
        <h2 className="text-base sm:text-lg font-semibold text-neutral-900">
          {title}
        </h2>
        {action && <div>{action}</div>}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
