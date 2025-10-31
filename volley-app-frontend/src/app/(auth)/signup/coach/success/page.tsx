"use client";

import { Suspense } from "react";
import { SuccessContent } from "../../../../../features/auth/components/signup/SuccessContent";

/**
 * Coach Signup Success Page
 *
 * Page affichée après inscription réussie d'un coach
 * Wrapper avec Suspense pour useSearchParams (Next.js 16 requirement)
 */
export default function CoachSignupSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
            <p className="mt-4 text-neutral-600">Chargement...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
