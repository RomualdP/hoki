import type { ReactNode } from "react";

/**
 * Auth Layout
 *
 * Layout pour les pages d'authentification (login, signup)
 * Sans navigation principale, design épuré centré sur le formulaire
 */

interface AuthLayoutProps {
  readonly children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
