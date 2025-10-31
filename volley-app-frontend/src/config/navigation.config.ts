import type { Icon } from "@tabler/icons-react";
import {
  IconLayoutDashboard,
  IconPlayVolleyball,
  IconUsers,
  IconBallVolleyball,
  IconCalendar,
} from "@tabler/icons-react";
import { ROUTES } from "../constants";

export type ClubRole = "OWNER" | "COACH" | "PLAYER";

export interface NavLink {
  href: string;
  label: string;
  icon: Icon;
  roles: ClubRole[];
}

/**
 * Génère les liens de navigation en fonction du rôle de l'utilisateur
 *
 * @param clubRole - Le rôle de l'utilisateur dans le club
 * @returns Liste des liens de navigation
 */
export function getNavLinks(clubRole: ClubRole | null): NavLink[] {
  const isOwner = clubRole === "OWNER";
  const isCoach = clubRole === "COACH";

  return [
    {
      href: isOwner
        ? ROUTES.DASHBOARD.COACH
        : isCoach
          ? ROUTES.DASHBOARD.ASSISTANT
          : ROUTES.DASHBOARD.PLAYER,
      label: "Dashboard",
      icon: IconLayoutDashboard,
      roles: ["OWNER", "COACH", "PLAYER"],
    },
    {
      href: ROUTES.CLUB,
      label: "Mon club",
      icon: IconBallVolleyball,
      roles: ["OWNER", "COACH", "PLAYER"],
    },
    {
      href: ROUTES.TEAMS,
      label: "Mes équipes",
      icon: IconUsers,
      roles: ["OWNER", "COACH", "PLAYER"],
    },
    {
      href: ROUTES.PLAYERS,
      label: "Mes joueurs",
      icon: IconPlayVolleyball,
      roles: ["OWNER", "COACH"],
    },
    {
      href: ROUTES.MATCHES,
      label: "Matchs",
      icon: IconCalendar,
      roles: ["OWNER", "COACH", "PLAYER"],
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
