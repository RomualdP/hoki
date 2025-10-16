import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { IUnitOfWork, PrismaTransactionClient } from './unit-of-work.interface';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly db: DatabaseService) {}

  async execute<T>(
    work: (tx: PrismaTransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.db.$transaction(async (tx) => {
      return work(tx);
    });
  }
}
