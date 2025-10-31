/**
 * Page de sélection de rôle pour l'inscription
 *
 * Permet à l'utilisateur de choisir son rôle :
 * - Propriétaire (créer un club)
 * - Joueur (rejoindre via invitation)
 * - Coach (aider via invitation)
 */

import Link from "next/link";
import { RoleSelector } from "../../../features/auth/components/signup/RoleSelector";
import { ROUTES } from "../../../constants";

export default function SignupPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 font-heading">
          Inscription
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Choisissez votre rôle pour commencer
        </p>
      </div>

      {/* Role Selection */}
      <RoleSelector />

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Vous avez déjà un compte ?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
