/**
 * Page d'inscription Coach
 *
 * Formulaire multi-step pour créer un compte coach + club + abonnement
 */

import Link from "next/link";
import { CoachSignupForm } from "../../../../features/auth/components/signup/CoachSignupForm";
import { ROUTES } from "../../../../constants";

export default function SignupCoachPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">
          Inscription Coach
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Créez votre club et commencez à gérer vos équipes
        </p>
      </div>

      {/* Form */}
      <CoachSignupForm />

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
