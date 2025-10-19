import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

/**
 * ClubManagementModule - Bounded Context for Club & Subscription Management
 *
 * This module implements DDD (Domain-Driven Design) with CQRS pattern.
 *
 * Architecture:
 * - Domain Layer: Entities, Value Objects, Repository Interfaces, Domain Services
 * - Application Layer: Commands, Queries, Handlers, Read Models
 * - Infrastructure Layer: Repository Implementations, Mappers, External Services
 * - Presentation Layer: Controllers, DTOs
 */

// Presentation Layer - Controllers
import { ClubsController } from './presentation/clubs.controller';
import { SubscriptionsController } from './presentation/subscriptions.controller';
import { InvitationsController } from './presentation/invitations.controller';

// Application Layer - Command & Query Handlers
import { CommandHandlers } from './application/commands';
import { QueryHandlers } from './application/queries';

// Infrastructure Layer - Repository Implementations
import { RepositoryProviders } from './infrastructure/persistence/repositories';

// Domain Layer - Domain Services
import { SubscriptionLimitService } from './domain/services/subscription-limit.service';
import { ClubTransferService } from './domain/services/club-transfer.service';

@Module({
  imports: [CqrsModule],
  controllers: [
    ClubsController,
    SubscriptionsController,
    InvitationsController,
  ],
  providers: [
    // CQRS Handlers
    ...CommandHandlers,
    ...QueryHandlers,
    // Repository Implementations
    ...RepositoryProviders,
    // Domain Services
    SubscriptionLimitService,
    ClubTransferService,
  ],
  exports: [],
})
export class ClubManagementModule {}
