"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui";
import { Input, Button } from "../../../components";
import { loginAction } from "../../../features/auth/actions/login.action";
import { ROUTES } from "../../../constants";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    startTransition(async () => {
      try {
        const result = await loginAction({
          email: formData.email,
          password: formData.password,
        });

        if (!result.success) {
          setErrors({ general: result.error || "Erreur lors de la connexion" });
        }
      } catch (error) {
        // If redirect() was called, Next.js throws a special error
        // We need to let it propagate
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
          throw error;
        }

        setErrors({
          general:
            error instanceof Error
              ? error.message
              : "Erreur lors de la connexion",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 font-heading">
          Connexion
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Connectez-vous à votre compte VolleyApp
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authentification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              name="email"
              type="email"
              label="Adresse email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="votre@email.com"
              required
              error={errors.email}
              disabled={isPending}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              error={errors.password}
              disabled={isPending}
            />

            {errors.general && (
              <div className="text-sm text-red-600 text-center">
                {errors.general}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link
                href={ROUTES.SIGNUP.BASE}
                className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
              >
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
