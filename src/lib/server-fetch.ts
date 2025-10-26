import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ServerFetchOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

/**
 * Server-side fetch utility
 *
 * Fetches data from the backend API in Server Components
 * Automatically includes httpOnly cookies for authentication
 *
 * @param endpoint - API endpoint (ex: "/teams")
 * @param options - Fetch options
 * @returns Promise<T | null>
 */
export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<T | null> {
  const { headers = {}, requireAuth = true, ...fetchOptions } = options;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        ...headers,
      },
      credentials: "include",
      // cache: fetchOptions.cache || "no-store",
    });

    if (!response.ok) {
      if (requireAuth && response.status === 401) {
        return null;
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const result = await response.json();

    // Return the full response object so consumers can access success, data, meta, etc.
    return result;
  } catch (error) {
    console.error(`[serverFetch] Error fetching ${endpoint}:`, error);

    if (requireAuth) {
      return null;
    }

    throw error;
  }
}
