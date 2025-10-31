import { Injectable } from '@nestjs/common';
import { ITrainingRegistrationRepository } from '../../../domain/repositories/training-registration.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { TrainingRegistrationReadModel } from '../../read-models/training-registration.read-model';
import { GetTrainingRegistrationsQuery } from './get-training-registrations.query';

@Injectable()
export class GetTrainingRegistrationsHandler {
  constructor(
    private readonly registrationRepository: ITrainingRegistrationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    query: GetTrainingRegistrationsQuery,
  ): Promise<TrainingRegistrationReadModel[]> {
    const registrations = await this.registrationRepository.findByTrainingId({
      trainingId: query.trainingId,
      status: query.status,
    });

    const userIds = registrations.map((reg) => reg.userId);
    const users = await this.userRepository.findManyByIdsBasicInfo(userIds);

    const userMap = new Map(users.map((user) => [user.id, user]));

    return registrations.map((reg) => {
      const user = userMap.get(reg.userId);
      return {
        id: reg.id,
        trainingId: reg.trainingId,
        userId: reg.userId,
        status: reg.status,
        registeredAt: reg.registeredAt,
        cancelledAt: reg.cancelledAt,
        user: user
          ? {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              avatar: user.avatar,
            }
          : {
              id: reg.userId,
              firstName: 'Unknown',
              lastName: 'User',
              email: '',
              avatar: null,
            },
      };
    });
  }
}
