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
@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ClubManagementModule {}
