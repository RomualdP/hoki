"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IconLogout } from "@tabler/icons-react";
import { useAuthStore } from "../../store";
import { useAuthApi } from "../../features/auth/hooks";
import { ROUTES } from "../../constants";
import {
  getNavLinks,
  getVisibleNavLinks,
} from "../../config/navigation.config";

/**
 * AppHeader Component (Sidebar)
 *
 * Sidebar de navigation vertical avec navigation adaptative selon le rôle utilisateur
 * Affiché sur toutes les pages sauf auth (login, signup)
 */
export function AppHeader() {
  const { clubRole, user, isAuthenticated } = useAuthStore();
  const { logout, isLoading } = useAuthApi();
  const router = useRouter();
  const pathname = usePathname();

  // Don't show sidebar on auth pages
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/register")
  ) {
    return null;
  }

  // Don't show sidebar if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const isCoach = clubRole === "COACH";
  const isAssistant = clubRole === "ASSISTANT_COACH";

  // Get navigation links based on role
  const navLinks = getNavLinks(clubRole);
  const visibleLinks = getVisibleNavLinks(navLinks, clubRole);

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        router.push(ROUTES.LOGIN);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-surface border-r-[12px] border-border-emphasis shadow-sm flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b-6 border-white">
        <Link
          href={
            isCoach
              ? ROUTES.DASHBOARD.COACH
              : isAssistant
                ? ROUTES.DASHBOARD.ASSISTANT
                : ROUTES.DASHBOARD.PLAYER
          }
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/images/logo_volley_app.png"
            alt="Hoki Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-2xl font-heading text-orange-600">Hoki</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <link.icon size={20} stroke={2} />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t-6 border-white">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 transition-colors mb-2"
        >
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 font-semibold">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p
              className={`text-xs truncate ${
                isCoach
                  ? "text-orange-600"
                  : isAssistant
                    ? "text-blue-600"
                    : "text-green-600"
              }`}
            >
              {isCoach ? "Coach" : isAssistant ? "Assistant" : "Joueur"}
            </p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-orange-600 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconLogout size={18} stroke={2} />
          <span>{isLoading ? "Déconnexion..." : "Déconnexion"}</span>
        </button>
      </div>
    </aside>
  );
}
