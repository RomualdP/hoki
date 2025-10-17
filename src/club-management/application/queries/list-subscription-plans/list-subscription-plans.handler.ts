import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ListSubscriptionPlansQuery } from './list-subscription-plans.query';
import { SubscriptionPlans } from '../../../domain/value-objects/subscription-plan.vo';
import { SubscriptionPlanReadModel } from '../../read-models/subscription-plan.read-model';

@Injectable()
@QueryHandler(ListSubscriptionPlansQuery)
export class ListSubscriptionPlansHandler
  implements
    IQueryHandler<ListSubscriptionPlansQuery, SubscriptionPlanReadModel[]>
{
  execute(): Promise<SubscriptionPlanReadModel[]> {
    const plans = SubscriptionPlans.getAll();

    return Promise.resolve(
      plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        maxTeams: plan.maxTeams,
        features: plan.features,
        formattedPrice: plan.getFormattedPrice(),
        isFree: plan.isFree(),
        hasUnlimitedTeams: plan.hasUnlimitedTeams(),
      })),
    );
  }
}
