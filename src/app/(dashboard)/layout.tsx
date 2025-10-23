import type { ReactNode } from "react";

interface DashboardLayoutProps {
  readonly children: ReactNode;
  readonly modal: ReactNode;
}

/**
 * Dashboard Layout
 *
 * Layout pour les pages du dashboard avec:
 * - Slot @modal pour Parallel Routes
 * - Wrapper avec padding-top pour le header fixe (hérité du root layout)
 */
export default function DashboardLayout({
  children,
  modal,
}: DashboardLayoutProps) {
  return (
    <>
      {children}
      {/* Modal Slot (Parallel Routes) */}
      {modal}
    </>
  );
}
