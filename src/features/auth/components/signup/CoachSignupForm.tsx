/**
 * CoachSignupForm Component (Smart)
 *
 * Formulaire multi-step pour l'inscription Coach
 * Étapes :
 * 1. Informations personnelles
 * 2. Informations du club
 * 3. Choix du plan d'abonnement
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "../../../../components";
import { SignupStep } from "./SignupStep";
import { PlanSelectorForSignup } from "./PlanSelectorForSignup";
import { signupCoach } from "../../api/signup.api";
import { useAuthStore } from "../../../../store/useAuthStore";
import { ROUTES } from "../../../../constants";
import type { SignupCoachDto } from "../../types/signup.types";
import type { SubscriptionPlanId } from "../../../club-management/types";

type Step = 1 | 2 | 3;

interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;

  // Step 2
  clubName: string;
  clubDescription: string;

  // Step 3
  planId: SubscriptionPlanId | null;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  clubName?: string;
  planId?: string;
  general?: string;
}

export function CoachSignupForm() {
  const router = useRouter();
  const { loginUser } = useAuthStore();
  const [isPending, startTransition] = useTransition();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    clubName: "",
    clubDescription: "",
    planId: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Prénom requis";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Nom requis";
    }
    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email invalide";
    }
    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "6 caractères minimum";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.clubName.trim()) {
      newErrors.clubName = "Nom du club requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.planId) {
      newErrors.planId = "Veuillez sélectionner un plan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid && currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const signupData: SignupCoachDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        password: formData.password,
        clubName: formData.clubName.trim(),
        clubDescription: formData.clubDescription.trim() || undefined,
        planId: formData.planId!,
      };

      const response = await signupCoach(signupData);

      // Token is now automatically set as httpOnly cookie by backend

      // Create User object with required fields
      const user = {
        ...response.user,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      loginUser(
        user,
        response.user.role,
        response.user.clubId || undefined,
        response.user.clubRole,
      );

      // Redirection
      if (response.checkoutUrl) {
        // Plan payant : redirection vers Stripe
        window.location.href = response.checkoutUrl;
      } else {
        // Plan gratuit : redirection vers dashboard
        startTransition(() => {
          router.push(ROUTES.MATCHES); // TODO: Changer pour dashboard coach
        });
      }
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'inscription",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Informations personnelles */}
      {currentStep === 1 && (
        <SignupStep
          title="Informations personnelles"
          description="Créez votre compte"
          stepNumber={1}
          totalSteps={3}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                name="firstName"
                label="Prénom"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                error={errors.firstName}
                required
              />
              <Input
                id="lastName"
                name="lastName"
                label="Nom"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                error={errors.lastName}
                required
              />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label="Adresse email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={errors.email}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              error={errors.password}
              required
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              required
            />

            <Button
              variant="primary"
              size="lg"
              className="w-full min-h-[44px]"
              onClick={handleNext}
            >
              Suivant
            </Button>
          </div>
        </SignupStep>
      )}

      {/* Step 2: Informations du club */}
      {currentStep === 2 && (
        <SignupStep
          title="Créez votre club"
          description="Donnez un nom à votre club"
          stepNumber={2}
          totalSteps={3}
        >
          <div className="space-y-4">
            <Input
              id="clubName"
              name="clubName"
              label="Nom du club"
              value={formData.clubName}
              onChange={(e) => updateField("clubName", e.target.value)}
              error={errors.clubName}
              required
            />

            <Input
              id="clubDescription"
              name="clubDescription"
              label="Description (optionnel)"
              value={formData.clubDescription}
              onChange={(e) => updateField("clubDescription", e.target.value)}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 min-h-[44px]"
                onClick={handleBack}
              >
                Retour
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1 min-h-[44px]"
                onClick={handleNext}
              >
                Suivant
              </Button>
            </div>
          </div>
        </SignupStep>
      )}

      {/* Step 3: Choix du plan */}
      {currentStep === 3 && (
        <SignupStep
          title="Choisissez votre plan"
          description="Vous pourrez changer de plan à tout moment"
          stepNumber={3}
          totalSteps={3}
        >
          <div className="space-y-4">
            <PlanSelectorForSignup
              selectedPlanId={formData.planId}
              onSelectPlan={(planId: SubscriptionPlanId) => {
                setFormData((prev) => ({ ...prev, planId }));
                setErrors((prev) => ({ ...prev, planId: undefined }));
              }}
            />

            {errors.planId && (
              <p className="text-sm text-red-600">{errors.planId}</p>
            )}

            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 min-h-[44px]"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Retour
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1 min-h-[44px]"
                onClick={handleSubmit}
                disabled={isSubmitting || isPending}
              >
                {isSubmitting ? "Inscription..." : "Créer mon compte"}
              </Button>
            </div>
          </div>
        </SignupStep>
      )}
    </div>
  );
}
