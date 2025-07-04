import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../constants';
import type { ApiResponse } from '../types';

interface UseApiState<T> {
  readonly data: T | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface UseApiOptions {
  readonly headers?: Record<string, string>;
  readonly baseUrl?: string;
}

export const useApi = <T = unknown>(options: UseApiOptions = {}) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const { headers = {}, baseUrl = API_BASE_URL } = options;

  const request = useCallback(
    async (
      endpoint: string,
      requestOptions: RequestInit = {}
    ): Promise<T | null> => {
      setState((previousState) => ({
        ...previousState,
        isLoading: true,
        error: null,
      }));

      try {
        const url = `${baseUrl}${endpoint}`;
        const token = localStorage.getItem('access_token');
        const defaultHeaders = {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        };

        const response = await fetch(url, {
          ...requestOptions,
          headers: {
            ...defaultHeaders,
            ...requestOptions.headers,
          },
        });

        if (!response.ok) {
          const errorMessage = await getErrorMessage(response);
          throw new Error(errorMessage);
        }

        const result: ApiResponse<T> = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Une erreur est survenue');
        }

        setState({
          data: result.data,
          isLoading: false,
          error: null,
        });

        return result.data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
        
        setState({
          data: null,
          isLoading: false,
          error: errorMessage,
        });

        return null;
      }
    },
    [baseUrl, headers]
  );

  const get = useCallback(
    (endpoint: string, options: RequestInit = {}) => {
      return request(endpoint, { ...options, method: 'GET' });
    },
    [request]
  );

  const post = useCallback(
    (endpoint: string, data?: unknown, options: RequestInit = {}) => {
      return request(endpoint, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [request]
  );

  const put = useCallback(
    (endpoint: string, data?: unknown, options: RequestInit = {}) => {
      return request(endpoint, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [request]
  );

  const deleteRequest = useCallback(
    (endpoint: string, options: RequestInit = {}) => {
      return request(endpoint, { ...options, method: 'DELETE' });
    },
    [request]
  );

  const clearError = useCallback(() => {
    setState((previousState) => ({
      ...previousState,
      error: null,
    }));
  }, []);

  return {
    ...state,
    get,
    post,
    put,
    delete: deleteRequest,
    clearError,
  };
};

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const errorData = await response.json();
    return errorData.message || `Erreur ${response.status}: ${response.statusText}`;
  } catch {
    return `Erreur ${response.status}: ${response.statusText}`;
  }
}; 