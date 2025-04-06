import { PrismaClient } from '@prisma/client';

type PrismaUser =
  ReturnType<PrismaClient['user']['findUnique']> extends Promise<infer T>
    ? NonNullable<T>
    : never;

export type User = PrismaUser;
export type UserWithoutPassword = Omit<User, 'password'>;

export interface UserPayload {
  sub: string;
  email: string;
}

export interface GoogleProfile {
  email: string;
  name: string;
  picture: string;
}
