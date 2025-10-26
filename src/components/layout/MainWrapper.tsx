"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * MainWrapper Component
 *
 * Wrapper pour le <main> qui applique conditionnellement le padding-left
 * pour compenser la sidebar uniquement sur les pages qui en ont besoin
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

  return <main className={isAuthPage ? "" : "pl-64"}>{children}</main>;
}
