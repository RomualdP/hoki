"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCircle2,
  Calendar,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store";
import { useAuthApi } from "../../features/auth/hooks";
import { ROUTES } from "../../constants";

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
      icon: LayoutDashboard,
      roles: ["COACH", "ASSISTANT_COACH", "PLAYER"],
    },
    {
      href: ROUTES.CLUB,
      label: "Mon club",
      icon: Building2,
      roles: ["COACH", "ASSISTANT_COACH", "PLAYER"],
    },
    {
      href: ROUTES.TEAMS,
      label: "Mes équipes",
      icon: Users,
      roles: ["COACH", "ASSISTANT_COACH", "PLAYER"],
    },
    {
      href: ROUTES.PLAYERS,
      label: "Mes joueurs",
      icon: UserCircle2,
      roles: ["COACH"],
    },
    {
      href: ROUTES.MATCHES,
      label: "Matchs",
      icon: Calendar,
      roles: ["COACH", "ASSISTANT_COACH", "PLAYER"],
    },
    {
      href: ROUTES.SUBSCRIPTION,
      label: "Mon abonnement",
      icon: CreditCard,
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
    <aside className="fixed top-0 left-0 h-screen w-64 bg-surface border-r-[12px] border-border-emphasis shadow-sm flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <Link
          href={
            isCoach
              ? ROUTES.DASHBOARD.COACH
              : isAssistant
                ? ROUTES.DASHBOARD.ASSISTANT
                : ROUTES.DASHBOARD.PLAYER
          }
          className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          VolleyApp
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
                  <link.icon size={20} strokeWidth={2} />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-neutral-200">
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
          <LogOut size={18} strokeWidth={2} />
          <span>{isLoading ? "Déconnexion..." : "Déconnexion"}</span>
        </button>
      </div>
    </aside>
  );
}
