/**
 * Page d'inscription Coach
 *
 * Formulaire d'inscription via invitation pour rejoindre un club en tant que coach
 */

import Link from "next/link";
import { Suspense } from "react";
import { AssistantSignupForm } from "../../../../features/auth/components/signup/AssistantSignupForm";
import { ROUTES } from "../../../../constants";

export default function SignupAssistantPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">
          Inscription Coach
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Rejoignez votre club via invitation
        </p>
      </div>

      {/* Form */}
      <Suspense fallback={<div className="text-center">Chargement...</div>}>
        <AssistantSignupForm />
      </Suspense>

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
