import { useCallback } from 'react';
import { useApi } from '../../../shared/hooks/useApi';
import { useUsersStore } from '../../../store';
import type { User } from '../../../types';

export const useUsersApi = () => {
  const usersApi = useApi<User[]>();
  const userApi = useApi<User>();
  const store = useUsersStore();

  const fetchUsers = useCallback(async () => {
    store.setLoading(true);
    
    try {
      const users = await usersApi.get('/users');
      if (users) {
        store.setUsers(users);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des utilisateurs';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserById = useCallback(async (userId: string) => {
    store.setLoading(true);
    
    try {
      const user = await userApi.get(`/users/${userId}`);
      if (user) {
        store.selectUser(user);
        return user;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement de l\'utilisateur';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    store.setLoading(true);
    
    try {
      const updatedUser = await userApi.put(`/users/${userId}`, updates);
      if (updatedUser) {
        store.updateUser(userId, updatedUser);
        return updatedUser;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'utilisateur';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteUser = useCallback(async (userId: string) => {
    store.setLoading(true);
    
    try {
      const success = await userApi.delete(`/users/${userId}`);
      if (success) {
        store.deleteUser(userId);
        return true;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'utilisateur';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return false;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // Store state
    users: store.users,
    selectedUser: store.selectedUser,
    isLoading: store.isLoading || usersApi.isLoading || userApi.isLoading,
    error: store.error || usersApi.error || userApi.error,
    
    // Store actions
    selectUser: store.selectUser,
    clearError: store.clearError,
    
    // API actions
    fetchUsers,
    fetchUserById,
    updateUser,
    deleteUser,
  };
}; 