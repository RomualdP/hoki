export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  profile: {
    gender: 'MALE' | 'FEMALE' | null;
  } | null;
  skills: Array<{ level: number }>;
  attributes: Array<{ attribute: string; value: number }>;
}

export const createMockUser = (overrides?: Partial<MockUser>): MockUser => {
  return {
    id: 'user-test-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    avatar: null,
    profile: {
      gender: 'MALE',
    },
    skills: [{ level: 5 }, { level: 4 }, { level: 3 }],
    attributes: [
      { attribute: 'FITNESS', value: 1.0 },
      { attribute: 'LEADERSHIP', value: 1.0 },
    ],
    ...overrides,
  };
};
