import { PrismaClient } from '@prisma/client';

export type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export interface IUnitOfWork {
  execute<T>(work: (tx: PrismaTransactionClient) => Promise<T>): Promise<T>;
}
