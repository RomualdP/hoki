"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  LogoutButton,
} from "@/components/ui";

/**
 * AccountActions - Dumb Component
 *
 * Account actions section with logout button
 * Props-based, no state, no effects
 *
 * Pattern: Dumb component (max 80 lines)
 */
export function AccountActions() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Actions du Compte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Déconnexion
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Déconnectez-vous de votre session actuelle. Vous devrez vous
              reconnecter pour accéder à votre compte.
            </p>
          </div>
          <LogoutButton variant="danger" className="shrink-0">
            Se déconnecter
          </LogoutButton>
        </div>
      </CardContent>
    </Card>
  );
}
