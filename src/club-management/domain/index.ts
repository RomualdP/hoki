/**
 * Domain Layer - Barrel Exports
 *
 * This file exports all domain layer components:
 * - Entities: Rich domain models with business logic
 * - Value Objects: Immutable objects defined by their attributes
 * - Repository Interfaces: Contracts for data access
 * - Domain Services: Business logic that doesn't belong to a single entity
 */

// Entities
export * from './entities';

// Value Objects
export * from './value-objects';

// Repository Interfaces
export * from './repositories';

// Domain Services
export * from './services';
