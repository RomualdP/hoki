import { useCallback } from 'react';
import { useApi } from '../../../shared/hooks/useApi';
import { useSkillsStore } from '../../../store';
import type { Skill } from '../../../types';

export const useSkillsApi = () => {
  const skillsApi = useApi<Skill[]>();
  const skillApi = useApi<Skill>();
  const store = useSkillsStore();

  const fetchSkills = useCallback(async () => {
    store.setLoading(true);
    
    try {
      const skills = await skillsApi.get('/skills');
      if (skills) {
        store.setSkills(skills);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des compétences';
      store.setError(errorMessage);
      // Continue with empty skills array instead of crashing
      store.setSkills([]);
    } finally {
      store.setLoading(false);
    }
  }, [skillsApi, store]);

  const createSkill = useCallback(async (skillData: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    store.setLoading(true);
    
    try {
      const newSkill = await skillApi.post('/skills', skillData);
      if (newSkill) {
        store.addSkill(newSkill);
        return newSkill;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la compétence';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  }, [skillApi, store]);

  const updateSkill = useCallback(async (skillId: string, updates: Partial<Skill>) => {
    store.setLoading(true);
    
    try {
      const updatedSkill = await skillApi.put(`/skills/${skillId}`, updates);
      if (updatedSkill) {
        store.updateSkill(skillId, updatedSkill);
        return updatedSkill;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la compétence';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  }, [skillApi, store]);

  const deleteSkill = useCallback(async (skillId: string) => {
    store.setLoading(true);
    
    try {
      const success = await skillApi.delete(`/skills/${skillId}`);
      if (success) {
        store.deleteSkill(skillId);
        return true;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de la compétence';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return false;
  }, [skillApi, store]);

  return {
    // Store state
    skills: store.skills,
    selectedSkill: store.selectedSkill,
    isLoading: store.isLoading || skillsApi.isLoading || skillApi.isLoading,
    error: store.error || skillsApi.error || skillApi.error,
    
    // Store actions
    selectSkill: store.selectSkill,
    clearError: store.clearError,
    
    // API actions
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  };
}; 