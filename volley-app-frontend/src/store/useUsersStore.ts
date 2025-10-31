import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '../types';

interface UsersState {
  readonly users: User[];
  readonly selectedUser: User | null;
  readonly searchQuery: string;
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface UsersActions {
  readonly setUsers: (users: User[]) => void;
  readonly addUser: (user: User) => void;
  readonly updateUser: (userId: string, updates: Partial<User>) => void;
  readonly deleteUser: (userId: string) => void;
  readonly selectUser: (user: User | null) => void;
  readonly setSearchQuery: (query: string) => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: string | null) => void;
  readonly clearError: () => void;
}

type UsersStore = UsersState & UsersActions;

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

export const useUsersStore = create<UsersStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setUsers: (users: User[]) => {
        set(
          (state) => ({
            ...state,
            users,
            isLoading: false,
            error: null,
          }),
          false,
          'users/setUsers'
        );
      },

      addUser: (user: User) => {
        set(
          (state) => ({
            ...state,
            users: [...state.users, user],
          }),
          false,
          'users/addUser'
        );
      },

      updateUser: (userId: string, updates: Partial<User>) => {
        set(
          (state) => ({
            ...state,
            users: state.users.map((user) =>
              user.id === userId ? { ...user, ...updates } : user
            ),
            selectedUser:
              state.selectedUser?.id === userId
                ? { ...state.selectedUser, ...updates }
                : state.selectedUser,
          }),
          false,
          'users/updateUser'
        );
      },

      deleteUser: (userId: string) => {
        set(
          (state) => ({
            ...state,
            users: state.users.filter((user) => user.id !== userId),
            selectedUser:
              state.selectedUser?.id === userId ? null : state.selectedUser,
          }),
          false,
          'users/deleteUser'
        );
      },

      selectUser: (user: User | null) => {
        set(
          (state) => ({
            ...state,
            selectedUser: user,
          }),
          false,
          'users/selectUser'
        );
      },

      setSearchQuery: (searchQuery: string) => {
        set(
          (state) => ({
            ...state,
            searchQuery,
          }),
          false,
          'users/setSearchQuery'
        );
      },

      setLoading: (isLoading: boolean) => {
        set(
          (state) => ({
            ...state,
            isLoading,
          }),
          false,
          'users/setLoading'
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
          'users/setError'
        );
      },

      clearError: () => {
        set(
          (state) => ({
            ...state,
            error: null,
          }),
          false,
          'users/clearError'
        );
      },
    }),
    {
      name: 'users-store',
    }
  )
); 