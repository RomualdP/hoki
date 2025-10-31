import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SkillDefinition, VolleyballSkill } from '../types';
import { getAllSkillDefinitions } from '../constants/volleyball-skills';

interface SkillsState {
  readonly skillDefinitions: SkillDefinition[];
  readonly selectedSkill: VolleyballSkill | null;
}

interface SkillsActions {
  readonly selectSkill: (skill: VolleyballSkill | null) => void;
  readonly getSkillDefinitions: () => SkillDefinition[];
}

type SkillsStore = SkillsState & SkillsActions;

const initialState: SkillsState = {
  skillDefinitions: getAllSkillDefinitions(),
  selectedSkill: null,
};

export const useSkillsStore = create<SkillsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      selectSkill: (skill: VolleyballSkill | null) => {
        set(
          (state) => ({
            ...state,
            selectedSkill: skill,
          }),
          false,
          'skills/selectSkill'
        );
      },

      getSkillDefinitions: () => {
        return get().skillDefinitions;
      },
    }),
    {
      name: 'skills-store',
    }
  )
);