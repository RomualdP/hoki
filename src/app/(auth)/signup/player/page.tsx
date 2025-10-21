/**
 * Page d'inscription Player
 *
 * Formulaire d'inscription via invitation pour rejoindre un club
 */

import Link from "next/link";
import { PlayerSignupForm } from "../../../../features/auth/components/signup/PlayerSignupForm";
import { ROUTES } from "../../../../constants";

export default function SignupPlayerPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">
          Inscription Joueur
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Rejoignez votre club via invitation
        </p>
      </div>

      {/* Form */}
      <PlayerSignupForm />

      {/* Back Link */}
      <div className="text-center">
        <Link
          href={ROUTES.SIGNUP.BASE}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Changer de rôle
        </Link>
      </div>
    </div>
  );
}
