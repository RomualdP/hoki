import type { MatchStatus } from "@/types";

/**
 * Match Status Utilities
 *
 * Helper functions for match status display
 */

export function getStatusColor(status: MatchStatus): string {
  switch (status) {
    case "SCHEDULED":
      return "bg-blue-100 text-blue-800";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusLabel(status: MatchStatus): string {
  switch (status) {
    case "SCHEDULED":
      return "Programmé";
    case "IN_PROGRESS":
      return "En cours";
    case "COMPLETED":
      return "Terminé";
    case "CANCELLED":
      return "Annulé";
    default:
      return status;
  }
}

export const MATCH_STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "SCHEDULED", label: "Programmé" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "COMPLETED", label: "Terminé" },
  { value: "CANCELLED", label: "Annulé" },
];
