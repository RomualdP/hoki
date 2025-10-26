"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserProfileApi } from "@/features/users/hooks/useUserProfileApi";
import { useAuthStore } from "@/store";
import { ROUTES } from "@/constants";
import { ProfileForm } from "@/features/users/components/ProfileForm";
import { PasswordChangeForm } from "@/features/users/components/PasswordChangeForm";
import { AccountActions } from "@/features/users/components/AccountActions";
import { SubscriptionSection } from "@/features/club-management/components/SubscriptionSection";
import type { Gender } from "@/types";

/**
 * Profile Page - Client Component
 *
 * User profile page with personal info, password change, and account actions
 * Client Component for form interactivity and validation
 *
 * Pattern: Smart Component composition (max 100 lines)
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, clubRole } = useAuthStore();
  const { fetchUserProfile } = useUserProfileApi();
  const isInitialized = useRef(false);
  const [initialGender, setInitialGender] = useState<Gender | null>(null);

  const isCoach = clubRole === "COACH";

  // Initialize profile data when user is loaded (only once)
  useEffect(() => {
    const initializeProfileData = async () => {
      if (user && !isInitialized.current) {
        isInitialized.current = true;

        try {
          const profile = await fetchUserProfile(user.id);
          if (profile?.gender) {
            setInitialGender(profile.gender as Gender);
          }
        } catch {
          // Ignore profile fetch errors
        }
      }
    };

    initializeProfileData();
  }, [user, fetchUserProfile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && user === null) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, user, router]);

  // Loading state
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Chargement...
          </h1>
          <p className="mt-2 text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-heading">
        Mon Profil
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <ProfileForm user={user} initialGender={initialGender} />
        <PasswordChangeForm />
        {isCoach && <SubscriptionSection />}
        <AccountActions />
      </div>
    </div>
  );
}
