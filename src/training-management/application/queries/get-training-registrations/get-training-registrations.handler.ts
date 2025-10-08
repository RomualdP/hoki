import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import { RegistrationStatus } from '@prisma/client';
import { TrainingRegistrationReadModel } from '../../read-models/training-registration.read-model';
import { GetTrainingRegistrationsQuery } from './get-training-registrations.query';

@Injectable()
export class GetTrainingRegistrationsHandler {
  constructor(private readonly db: DatabaseService) {}

  async execute(
    query: GetTrainingRegistrationsQuery,
  ): Promise<TrainingRegistrationReadModel[]> {
    const whereClause: any = {
      trainingId: query.trainingId,
    };

    if (query.status) {
      whereClause.status = query.status as RegistrationStatus;
    }

    const registrations = await this.db.trainingRegistration.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        registeredAt: 'asc',
      },
    });

    return registrations.map((reg) => ({
      id: reg.id,
      trainingId: reg.trainingId,
      userId: reg.userId,
      status: reg.status,
      registeredAt: reg.registeredAt,
      cancelledAt: reg.cancelledAt,
      user: {
        id: reg.user.id,
        firstName: reg.user.firstName,
        lastName: reg.user.lastName,
        email: reg.user.email,
        avatar: reg.user.avatar,
      },
    }));
  }
}
