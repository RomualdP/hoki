"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { Input, Button } from "@/components";

/**
 * PasswordChangeForm - Smart Component
 *
 * Password change form with validation
 * Client Component for form interactivity
 *
 * Pattern: Smart Component (max 100 lines)
 */
interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordChangeForm() {
  const [isChanging, setIsChanging] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<PasswordFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PasswordFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<PasswordFormData> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Mot de passe actuel requis";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "Nouveau mot de passe requis";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword =
        "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: Implement password change API
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChanging(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changer le Mot de Passe</CardTitle>
      </CardHeader>
      <CardContent>
        {!isChanging ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Modifiez votre mot de passe pour sécuriser votre compte.
            </p>
            <Button variant="outline" onClick={() => setIsChanging(true)}>
              Changer le mot de passe
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              label="Mot de passe actuel"
              value={passwordData.currentPassword}
              onChange={handleChange}
              required
              error={errors.currentPassword}
            />
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              label="Nouveau mot de passe"
              value={passwordData.newPassword}
              onChange={handleChange}
              required
              error={errors.newPassword}
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmer le nouveau mot de passe"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              required
              error={errors.confirmPassword}
            />
            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                Changer
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsChanging(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setErrors({});
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
