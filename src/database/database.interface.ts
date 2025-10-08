import { PrismaClient } from '@prisma/client';

export interface IDatabase extends PrismaClient {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
}
