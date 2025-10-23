import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCircle2,
  Calendar,
} from "lucide-react";
import { ROUTES } from "../constants";

export type ClubRole = "COACH" | "ASSISTANT_COACH" | "PLAYER";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: ClubRole[];
}

/**
 * Génère les liens de navigation en fonction du rôle de l'utilisateur
 *
 * @param clubRole - Le rôle de l'utilisateur dans le club
 * @returns Liste des liens de navigation
 */
export function getNavLinks(clubRole: ClubRole | null): NavLink[] {
  const isCoach = clubRole === "COACH";
  const isAssistant = clubRole === "ASSISTANT_COACH";

  return [
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
  ];
}

/**
 * Filtre les liens de navigation visibles selon le rôle de l'utilisateur
 *
 * @param navLinks - Liste de tous les liens de navigation
 * @param clubRole - Le rôle de l'utilisateur dans le club
 * @returns Liste des liens visibles pour ce rôle
 */
export function getVisibleNavLinks(
  navLinks: NavLink[],
  clubRole: ClubRole | null,
): NavLink[] {
  if (!clubRole) return [];
  return navLinks.filter((link) => link.roles.includes(clubRole));
}
