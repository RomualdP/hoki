import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UserSkill } from '../types';

interface UserSkillsState {
  readonly userSkills: Record<string, UserSkill[]>;
  readonly optimisticUpdates: Record<string, UserSkill[]>;
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface UserSkillsActions {
  readonly setUserSkills: (userId: string, skills: UserSkill[]) => void;
  readonly addUserSkill: (userId: string, skill: UserSkill) => void;
  readonly updateUserSkill: (userId: string, userSkillId: string, updates: Partial<UserSkill>) => void;
  readonly deleteUserSkill: (userId: string, userSkillId: string) => void;
  readonly applyOptimisticUpdate: (userId: string, skills: UserSkill[]) => void;
  readonly rollbackOptimisticUpdate: (userId: string) => void;
  readonly commitOptimisticUpdate: (userId: string, skills: UserSkill[]) => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: string | null) => void;
  readonly clearError: () => void;
}

type UserSkillsStore = UserSkillsState & UserSkillsActions;

const initialState: UserSkillsState = {
  userSkills: {},
  optimisticUpdates: {},
  isLoading: false,
  error: null,
};

export const useUserSkillsStore = create<UserSkillsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setUserSkills: (userId: string, skills: UserSkill[]) => {
        set(
          (state) => ({
            ...state,
            userSkills: {
              ...state.userSkills,
              [userId]: skills,
            },
            isLoading: false,
            error: null,
          }),
          false,
          'userSkills/setUserSkills'
        );
      },

      addUserSkill: (userId: string, skill: UserSkill) => {
        set(
          (state) => ({
            ...state,
            userSkills: {
              ...state.userSkills,
              [userId]: [...(state.userSkills[userId] || []), skill],
            },
          }),
          false,
          'userSkills/addUserSkill'
        );
      },

      updateUserSkill: (userId: string, userSkillId: string, updates: Partial<UserSkill>) => {
        set(
          (state) => ({
            ...state,
            userSkills: {
              ...state.userSkills,
              [userId]: (state.userSkills[userId] || []).map((skill) =>
                skill.id === userSkillId ? { ...skill, ...updates } : skill
              ),
            },
          }),
          false,
          'userSkills/updateUserSkill'
        );
      },

      deleteUserSkill: (userId: string, userSkillId: string) => {
        set(
          (state) => ({
            ...state,
            userSkills: {
              ...state.userSkills,
              [userId]: (state.userSkills[userId] || []).filter(
                (skill) => skill.id !== userSkillId
              ),
            },
          }),
          false,
          'userSkills/deleteUserSkill'
        );
      },

      applyOptimisticUpdate: (userId: string, skills: UserSkill[]) => {
        const currentSkills = get().userSkills[userId] || [];
        set(
          (state) => ({
            ...state,
            optimisticUpdates: {
              ...state.optimisticUpdates,
              [userId]: currentSkills,
            },
            userSkills: {
              ...state.userSkills,
              [userId]: skills,
            },
          }),
          false,
          'userSkills/applyOptimisticUpdate'
        );
      },

      rollbackOptimisticUpdate: (userId: string) => {
        const originalSkills = get().optimisticUpdates[userId];
        if (originalSkills) {
          set(
            (state) => {
              const newOptimisticUpdates = { ...state.optimisticUpdates };
              delete newOptimisticUpdates[userId];
              return {
                ...state,
                userSkills: {
                  ...state.userSkills,
                  [userId]: originalSkills,
                },
                optimisticUpdates: newOptimisticUpdates,
              };
            },
            false,
            'userSkills/rollbackOptimisticUpdate'
          );
        }
      },

      commitOptimisticUpdate: (userId: string, skills: UserSkill[]) => {
        set(
          (state) => {
            const newOptimisticUpdates = { ...state.optimisticUpdates };
            delete newOptimisticUpdates[userId];
            return {
              ...state,
              userSkills: {
                ...state.userSkills,
                [userId]: skills,
              },
              optimisticUpdates: newOptimisticUpdates,
            };
          },
          false,
          'userSkills/commitOptimisticUpdate'
        );
      },

      setLoading: (isLoading: boolean) => {
        set(
          (state) => ({
            ...state,
            isLoading,
          }),
          false,
          'userSkills/setLoading'
        );
      },

      setError: (error: string | null) => {
        set(
          (state) => ({
            ...state,
            error,
            isLoading: false,
          }),
          false,
          'userSkills/setError'
        );
      },

      clearError: () => {
        set(
          (state) => ({
            ...state,
            error: null,
          }),
          false,
          'userSkills/clearError'
        );
      },
    }),
    {
      name: 'user-skills-store',
    }
  )
);