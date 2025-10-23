/**
 * PlayerSignupForm Component (Smart)
 *
 * Formulaire d'inscription pour un joueur via invitation
 * - Validation du token d'invitation
 * - Affichage du nom du club
 * - Warning si changement de club
 */

"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button } from "../../../../components";
import { SignupStep } from "./SignupStep";
import { ClubChangeWarning } from "./ClubChangeWarning";
import { signupPlayer, validateInvitationToken } from "../../api/signup.api";
import { useAuthStore } from "../../../../store/useAuthStore";
import { ROUTES } from "../../../../constants";
import type { SignupPlayerDto } from "../../types/signup.types";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  invitationToken: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  invitationToken?: string;
  general?: string;
}

export function PlayerSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser } = useAuthStore();
  const [isPending, startTransition] = useTransition();

  const [clubName, setClubName] = useState<string | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [hasUrlToken, setHasUrlToken] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    invitationToken: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hadPreviousClub, setHadPreviousClub] = useState(false);

  // Check for invitation token in URL on mount
  useEffect(() => {
    const invitationToken = searchParams.get("token");
    if (invitationToken) {
      setHasUrlToken(true);
      setIsValidatingToken(true);
      setFormData((prev) => ({ ...prev, invitationToken }));

      validateInvitationToken(invitationToken)
        .then((validation) => {
          if (validation.isValid) {
            setClubName(validation.clubName || null);
          } else {
            setErrors({
              invitationToken:
                validation.error || "Token d'invitation invalide ou expiré",
            });
          }
        })
        .catch(() => {
          setErrors({
            invitationToken: "Erreur lors de la validation du token",
          });
        })
        .finally(() => {
          setIsValidatingToken(false);
        });
    }
  }, [searchParams]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleValidateToken = async () => {
    if (!formData.invitationToken.trim()) {
      setErrors({ invitationToken: "Token d'invitation requis" });
      return;
    }

    setIsValidatingToken(true);
    setErrors({});

    try {
      const validation = await validateInvitationToken(
        formData.invitationToken.trim(),
      );
      if (validation.isValid) {
        setClubName(validation.clubName || null);
        setHasUrlToken(true);
      } else {
        setErrors({
          invitationToken:
            validation.error || "Token d'invitation invalide ou expiré",
        });
      }
    } catch {
      setErrors({
        invitationToken: "Erreur lors de la validation du token",
      });
    } finally {
      setIsValidatingToken(false);
    }
  };

  const validateForm = (): boolean => {
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
    if (!formData.invitationToken.trim()) {
      newErrors.invitationToken = "Token d'invitation requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const signupData: SignupPlayerDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        password: formData.password,
        invitationToken: formData.invitationToken.trim(),
      };

      const response = await signupPlayer(signupData);

      // Check if player had previous club
      if (response.hadPreviousClub) {
        setHadPreviousClub(true);
        setIsSubmitting(false);
        return;
      }

      // Token is now automatically set as httpOnly cookie by backend

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
      startTransition(() => {
        router.push(ROUTES.DASHBOARD.PLAYER);
      });
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

  const handleConfirmClubChange = async () => {
    // Re-submit after user confirms club change
    setHadPreviousClub(false);
    setIsSubmitting(true);

    try {
      const signupData: SignupPlayerDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        password: formData.password,
        invitationToken: formData.invitationToken.trim(),
      };

      const response = await signupPlayer(signupData);

      // Token is now automatically set as httpOnly cookie by backend

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

      startTransition(() => {
        router.push(ROUTES.DASHBOARD.PLAYER);
      });
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

  // Show club change warning
  if (hadPreviousClub) {
    return (
      <ClubChangeWarning
        newClubName={clubName || "ce club"}
        onConfirm={handleConfirmClubChange}
        onCancel={() => setHadPreviousClub(false)}
      />
    );
  }

  // Main form
  return (
    <SignupStep
      title="Rejoindre le club"
      description={clubName ? `Vous allez rejoindre : ${clubName}` : undefined}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Token validation section */}
        {!hasUrlToken && (
          <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              {`Entrez le code d'invitation fourni par votre coach`}
            </p>
            <div className="flex gap-2">
              <Input
                id="invitationToken"
                name="invitationToken"
                label="Code d'invitation"
                value={formData.invitationToken}
                onChange={(e) => updateField("invitationToken", e.target.value)}
                error={errors.invitationToken}
                required
                disabled={isValidatingToken}
                placeholder="Ex: abc123xyz..."
              />
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="mt-6 min-h-[44px]"
                onClick={handleValidateToken}
                disabled={isValidatingToken || !formData.invitationToken.trim()}
              >
                {isValidatingToken ? "Validation..." : "Valider"}
              </Button>
            </div>
            {clubName && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Invitation valide pour : <strong>{clubName}</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Personal information section */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            name="firstName"
            label="Prénom"
            value={formData.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            error={errors.firstName}
            required
            disabled={isSubmitting}
          />
          <Input
            id="lastName"
            name="lastName"
            label="Nom"
            value={formData.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            error={errors.lastName}
            required
            disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />

        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{errors.general}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full min-h-[44px]"
          disabled={isSubmitting || isPending || !clubName}
        >
          {isSubmitting ? "Inscription..." : "Rejoindre le club"}
        </Button>
      </form>
    </SignupStep>
  );
}
