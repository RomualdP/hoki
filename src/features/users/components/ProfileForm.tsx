"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { Input, Button } from "@/components";
import { Select } from "@/components/forms/Select";
import { useUserProfileApi } from "../hooks/useUserProfileApi";
import type { Gender, User } from "@/types";

/**
 * ProfileForm - Smart Component
 *
 * Profile information form with validation
 * Client Component for form interactivity
 *
 * Pattern: Smart Component (max 100 lines)
 */
interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: "" | Gender;
}

interface ProfileFormProps {
  readonly user: User;
  readonly initialGender?: Gender | null;
}

export function ProfileForm({ user, initialGender }: ProfileFormProps) {
  const { updateUserProfile } = useUserProfileApi();
  const [isEditing, setIsEditing] = useState(false);

  const nameParts = user.firstName?.includes(" ")
    ? user.firstName.split(" ")
    : [user.firstName || "", user.lastName || ""];

  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    email: user.email || "",
    gender: (initialGender ?? "") as "" | Gender,
  });

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProfileFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfileData((prev) => ({
      ...prev,
      gender: (e.target.value || "") as "" | Gender,
    }));
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!profileData.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!profileData.lastName.trim()) newErrors.lastName = "Nom requis";
    if (!profileData.email.trim()) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Format email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await updateUserProfile(user.id, {
      gender: profileData.gender || undefined,
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations Personnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="firstName"
            name="firstName"
            label="Prénom"
            value={profileData.firstName}
            onChange={handleChange}
            required
            disabled={!isEditing}
            error={errors.firstName}
          />
          <Input
            id="lastName"
            name="lastName"
            label="Nom"
            value={profileData.lastName}
            onChange={handleChange}
            required
            disabled={!isEditing}
            error={errors.lastName}
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={profileData.email}
            onChange={handleChange}
            required
            disabled={!isEditing}
            error={errors.email}
          />
          <Select
            id="gender"
            name="gender"
            label="Genre"
            value={profileData.gender || ""}
            onChange={handleGenderChange}
            options={[
              { value: "MALE", label: "Homme" },
              { value: "FEMALE", label: "Femme" },
            ]}
            placeholder="Sélectionner..."
            disabled={!isEditing}
          />
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </Button>
            ) : (
              <>
                <Button type="submit" variant="primary">
                  Sauvegarder
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
