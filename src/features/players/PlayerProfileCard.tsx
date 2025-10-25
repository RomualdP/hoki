"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import type { User } from "@/types";

/**
 * PlayerProfileCard - Client Component
 *
 * Displays player profile with avatar and level
 * Can be extended to handle profile editing with useState
 */

interface PlayerProfileCardProps {
  readonly user: User;
  readonly level: number;
}

export function PlayerProfileCard({ user, level }: PlayerProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        {/* User Avatar */}
        <div className="text-center mb-6">
          <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-orange-800">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Niveau: {level.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">{user.email}</p>
        </div>

        {/* Profile Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Rôle</span>
            <span className="text-sm text-gray-900">
              {getRoleLabel(user.clubRole)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getRoleLabel(role?: string | null): string {
  switch (role) {
    case "COACH":
      return "Coach";
    case "ASSISTANT_COACH":
      return "Assistant";
    case "PLAYER":
      return "Joueur";
    default:
      return "Membre";
  }
}
