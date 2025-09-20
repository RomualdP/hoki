import { useCallback } from 'react';
import { useApi } from '../../../shared/hooks/useApi';
import { useUserSkillsStore } from '../../../store';
import type { UserSkill, UserSkillCreateData, UserSkillUpdateData } from '../../../types';

export const useUserSkillsApi = () => {
  const skillsApi = useApi<UserSkill[]>();
  const skillApi = useApi<UserSkill>();
  const deleteApi = useApi<void>();
  const store = useUserSkillsStore();

  const fetchUserSkills = useCallback(async (userId: string) => {
    store.setLoading(true);
    
    try {
      const skills = await skillsApi.get(`/users/${userId}/skills`);
      if (skills) {
        store.setUserSkills(userId, skills);
        return skills;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des compétences';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addUserSkill = useCallback(async (userId: string, skillData: UserSkillCreateData) => {
    // Validate required fields
    if (!skillData.skillId || skillData.level == null) {
      throw new Error('skillId and level are required');
    }

    // Clean data before sending - remove empty strings and undefined values
    const cleanData: {
      skillId: string;
      level: number;
      notes?: string;
      experienceYears?: number;
    } = {
      skillId: skillData.skillId,
      level: skillData.level,
    };

    if (skillData.notes && typeof skillData.notes === 'string' && skillData.notes.trim() !== '') {
      cleanData.notes = skillData.notes.trim();
    }

    if (skillData.experienceYears && typeof skillData.experienceYears === 'number') {
      cleanData.experienceYears = skillData.experienceYears;
    }

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticSkill: UserSkill = {
      id: tempId,
      userId,
      skillId: skillData.skillId,
      skill: {
        id: skillData.skillId,
        name: '',
        category: 'ATTACK',
        description: '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      level: skillData.level,
      notes: skillData.notes,
      experienceYears: skillData.experienceYears,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const currentSkills = store.userSkills[userId] || [];
    const optimisticSkills = [...currentSkills, optimisticSkill];
    store.applyOptimisticUpdate(userId, optimisticSkills);

    try {
      const newSkill = await skillApi.post(`/users/${userId}/skills`, cleanData);
      
      if (newSkill) {
        // Replace optimistic skill with real one
        const finalSkills = currentSkills.concat(newSkill);
        store.commitOptimisticUpdate(userId, finalSkills);
        return newSkill;
      } else {
        // Rollback on failure
        store.rollbackOptimisticUpdate(userId);
      }
    } catch (error) {
      // Rollback on error
      store.rollbackOptimisticUpdate(userId);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'ajout de la compétence';
      store.setError(errorMessage);
    }
    
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUserSkill = useCallback(async (
    userId: string,
    userSkillId: string,
    updates: UserSkillUpdateData
  ) => {
    const currentSkills = store.userSkills[userId] || [];
    const skillToUpdate = currentSkills.find(s => s.id === userSkillId);

    if (!skillToUpdate) return null;

    // Clean data before sending - remove empty strings and undefined values
    const cleanUpdates: {
      level?: number;
      notes?: string;
      experienceYears?: number;
    } = {};

    if (
      updates.level !== undefined &&
      typeof updates.level === 'number' &&
      (updates.level === 0 || (updates.level >= 1 && updates.level <= 10))
    ) {
      cleanUpdates.level = updates.level;
    }

    if (updates.notes !== undefined && updates.notes !== null && typeof updates.notes === 'string' && updates.notes.trim() !== '') {
      cleanUpdates.notes = updates.notes.trim();
    }

    if (updates.experienceYears !== undefined && typeof updates.experienceYears === 'number') {
      cleanUpdates.experienceYears = updates.experienceYears;
    }

    // If no valid updates, return early
    if (Object.keys(cleanUpdates).length === 0) {
      return skillToUpdate;
    }

    // Optimistic update
    const optimisticSkills = currentSkills.map(skill =>
      skill.id === userSkillId
        ? { ...skill, ...updates, updatedAt: new Date() }
        : skill
    );
    store.applyOptimisticUpdate(userId, optimisticSkills);

    try {
      const updatedSkill = await skillApi.put(
        `/users/${userId}/skills/${skillToUpdate.skillId}`,
        cleanUpdates
      );
      
      if (updatedSkill) {
        // Commit the update with server response
        const finalSkills = currentSkills.map(skill =>
          skill.id === userSkillId ? updatedSkill : skill
        );
        store.commitOptimisticUpdate(userId, finalSkills);
        return updatedSkill;
      } else {
        // Rollback on failure
        store.rollbackOptimisticUpdate(userId);
      }
    } catch (error) {
      // Rollback on error
      store.rollbackOptimisticUpdate(userId);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la compétence';
      store.setError(errorMessage);
    }
    
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteUserSkill = useCallback(async (userId: string, userSkillId: string) => {
    const currentSkills = store.userSkills[userId] || [];
    const skillToDelete = currentSkills.find(s => s.id === userSkillId);
    
    if (!skillToDelete) return false;

    // Optimistic update
    const optimisticSkills = currentSkills.filter(skill => skill.id !== userSkillId);
    store.applyOptimisticUpdate(userId, optimisticSkills);

    try {
      await deleteApi.delete(`/users/${userId}/skills/${skillToDelete.skillId}`);
      
      // Commit the deletion
      store.commitOptimisticUpdate(userId, optimisticSkills);
      return true;
    } catch (error) {
      // Rollback on error
      store.rollbackOptimisticUpdate(userId);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de la compétence';
      store.setError(errorMessage);
      return false;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getUserSkills = useCallback((userId: string) => {
    return store.userSkills[userId] || [];
  }, [store.userSkills]);

  return {
    // Store state
    getUserSkills,
    isLoading: store.isLoading || skillsApi.isLoading || skillApi.isLoading || deleteApi.isLoading,
    error: store.error || skillsApi.error || skillApi.error || deleteApi.error,
    
    // Store actions
    clearError: store.clearError,
    
    // API actions
    fetchUserSkills,
    addUserSkill,
    updateUserSkill,
    deleteUserSkill,
  };
};