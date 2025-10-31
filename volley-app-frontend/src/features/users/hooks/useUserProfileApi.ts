import { useCallback } from 'react';
import { useApi } from '../../../shared/hooks/useApi';
import type { UserProfile, UserProfileUpdateData } from '../../../types';

export const useUserProfileApi = () => {
  const profileApi = useApi<UserProfile>();

  const fetchUserProfile = useCallback(async (userId: string) => {
    return await profileApi.get(`/users/${userId}/profile`);
  }, [profileApi]);

  const updateUserProfile = useCallback(async (userId: string, updates: UserProfileUpdateData) => {
    return await profileApi.put(`/users/${userId}/profile`, updates);
  }, [profileApi]);

  return {
    isLoading: profileApi.isLoading,
    error: profileApi.error,
    clearError: profileApi.clearError,
    fetchUserProfile,
    updateUserProfile,
  };
};
