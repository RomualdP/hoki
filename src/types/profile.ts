export type Gender = 'MALE' | 'FEMALE';

export interface UserProfile {
  readonly userId: string;
  readonly gender?: Gender;
}

export interface UserProfileUpdateData {
  readonly gender?: Gender;
}


