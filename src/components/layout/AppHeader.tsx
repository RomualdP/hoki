"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../../store";
import { useAuthApi } from "../../features/auth/hooks";
import { ROUTES } from "../../constants";

/**
 * AppHeader Component
 *
 * Header global avec navigation adaptative selon le rôle utilisateur
 * Affiché sur toutes les pages sauf auth (login, signup)
 */
export function AppHeader() {
  const { clubRole, user, isAuthenticated } = useAuthStore();
  const { logout, isLoading } = useAuthApi();
  const router = useRouter();
  const pathname = usePathname();

  // Don't show header on auth pages
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/register")
  ) {
    return null;
  }

  // Don't show header if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const isCoach = clubRole === "COACH";
  const isAssistant = clubRole === "ASSISTANT_COACH";
  const isPlayer = clubRole === "PLAYER";

  // Navigation links based on role
  const navLinks = [
    {
      href: isCoach
        ? ROUTES.DASHBOARD.COACH
        : isAssistant
          ? ROUTES.DASHBOARD.ASSISTANT
          : ROUTES.DASHBOARD.PLAYER,
      label: "Dashboard",
      roles: ["COACH", "ASSISTANT_COACH", "PLAYER"],
    },
    {
      href: ROUTES.CLUB,
      label: "Mon club",
      roles: ["COACH", "ASSISTANT_COACH", "PLAYER"],
    },
    {
      href: ROUTES.TEAMS,
      label: "Mes équipes",
      roles: ["COACH", "ASSISTANT_COACH", "PLAYER"],
    },
    {
      href: ROUTES.MATCHES,
      label: "Matchs",
      roles: ["COACH", "ASSISTANT_COACH", "PLAYER"],
    },
    {
      href: ROUTES.SUBSCRIPTION,
      label: "Mon abonnement",
      roles: ["COACH"],
    },
  ];

  const visibleLinks = navLinks.filter((link) =>
    link.roles.includes(clubRole || ""),
  );

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
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link
              href={
                isCoach
                  ? ROUTES.DASHBOARD.COACH
                  : isAssistant
                    ? ROUTES.DASHBOARD.ASSISTANT
                    : ROUTES.DASHBOARD.PLAYER
              }
              className="text-xl font-bold text-orange-600 font-heading hover:text-orange-700 transition-colors"
            >
              VolleyApp
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-100 text-orange-700"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="text-sm text-neutral-700 hidden sm:block hover:text-orange-600 transition-colors"
            >
              {user?.firstName} {user?.lastName}
            </Link>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                isCoach
                  ? "bg-orange-100 text-orange-700"
                  : isAssistant
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {isCoach ? "Coach" : isAssistant ? "Assistant" : "Joueur"}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="text-sm text-neutral-700 hover:text-orange-600 hover:bg-neutral-100 px-3 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Se déconnecter"
            >
              {isLoading ? "..." : "Déconnexion"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
