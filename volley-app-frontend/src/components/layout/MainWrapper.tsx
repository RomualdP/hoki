"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * MainWrapper Component
 *
 * Wrapper pour le <main> qui applique conditionnellement le padding
 * - Mobile: padding-top pour la navbar en haut
 * - Desktop: padding-left pour la sidebar à gauche
 */
interface MainWrapperProps {
  readonly children: ReactNode;
}

export function MainWrapper({ children }: MainWrapperProps) {
  const pathname = usePathname();

  // Don't apply padding on auth pages
  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/register");

  if (isAuthPage) {
    return <main>{children}</main>;
  }

  return (
    <main className="pt-16 md:pt-0 md:pl-64">
      {children}
    </main>
  );
}
