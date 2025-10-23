"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "../../../../constants";
import { useAuthStore } from "../../../../store";

/**
 * SuccessContent Component
 *
 * Contenu de la page de succès d'inscription coach
 * Séparé pour être enveloppé dans Suspense (useSearchParams requirement)
 */
export function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [countdown, setCountdown] = useState(5);

  const planId = searchParams.get("plan") || "BETA";
  const isPaid = planId !== "BETA";

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(ROUTES.DASHBOARD.COACH);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Inscription réussie ! 🎉
        </h1>

        <p className="text-neutral-600 mb-6">
          {isPaid
            ? "Votre paiement est en cours de traitement. Vous recevrez une confirmation par email."
            : "Votre compte a été créé avec succès. Vous pouvez maintenant créer votre première équipe !"}
        </p>

        <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
          <p className="text-sm text-neutral-700">
            Redirection automatique dans{" "}
            <span className="font-bold">{countdown}s</span>
          </p>
        </div>

        <Link
          href={ROUTES.DASHBOARD.COACH}
          className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          Accéder à mon dashboard
        </Link>
      </div>
    </div>
  );
}
