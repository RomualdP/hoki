"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ROUTES } from "@/constants";

interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      clubId?: string | null;
      clubRole?: string | null;
    };
    accessToken: string;
  };
  message?: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    clubId?: string | null;
    clubRole?: string | null;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Server Action: Login user
 *
 * Calls backend /auth/login and redirects to /matches on success
 * The backend sets httpOnly cookie which will be automatically included
 * in subsequent requests
 */
export async function loginAction(
  credentials: LoginCredentials,
): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Identifiants invalides",
      };
    }

    const result: LoginResponse = await response.json();

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.message || "Erreur lors de la connexion",
      };
    }

    // Set httpOnly cookie on Next.js domain (localhost:3000)
    // This allows Server Components to access the JWT via cookies()
    const cookieStore = await cookies();
    cookieStore.set("access_token", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    // redirect() automatically invalidates Next.js caches and performs server-side navigation
    redirect(ROUTES.MATCHES);
  } catch (error) {
    // If redirect() was called, it throws a special error that should propagate
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur lors de la connexion",
    };
  }
}
