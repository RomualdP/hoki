/**
 * API Client Base
 *
 * Base utilities for API calls using fetch
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Standard API response format from NestJS backend
 */
interface ApiResponse<T> {
  data: T;
  success: boolean;
}

/**
 * Custom error class for API errors
 */
export class ApiException extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiException";
    this.statusCode = statusCode;
  }
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from localStorage (or your auth store)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle non-JSON responses (like 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  const responseData = await response.json();

  if (!response.ok) {
    const error = responseData as ApiError;
    throw new ApiException(
      error.message || "Une erreur est survenue",
      response.status,
    );
  }

  // Check if response follows the standard { data, success } format
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData &&
    "success" in responseData
  ) {
    const apiResponse = responseData as ApiResponse<T>;
    return apiResponse.data;
  }
  return responseData as T;
}

/**
 * GET request
 */
export async function get<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "GET",
  });
}

/**
 * POST request
 */
export async function post<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request
 */
export async function put<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PATCH request
 */
export async function patch<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "DELETE",
  });
}
