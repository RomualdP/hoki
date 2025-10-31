import { ReactNode } from "react";

interface LayoutProps {
  readonly children: ReactNode;
}

/**
 * Layout Component (Legacy)
 *
 * Simple wrapper pour les pages legacy
 * Le header est maintenant géré par AppHeader dans le root layout
 * Ce composant fournit juste le padding-top pour le header fixe
 */
export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16">{children}</main>
    </div>
  );
};

Layout.displayName = "Layout";
