import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { PrismaUnitOfWork } from './unit-of-work';

export const UNIT_OF_WORK = 'IUnitOfWork';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: UNIT_OF_WORK,
      useClass: PrismaUnitOfWork,
    },
  ],
  exports: [DatabaseService, UNIT_OF_WORK],
})
export class DatabaseModule {}
