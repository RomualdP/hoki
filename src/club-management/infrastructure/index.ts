/**
 * Infrastructure Layer - Barrel Exports
 *
 * This file exports all infrastructure layer components:
 * - Repository Implementations: Concrete implementations of domain repository interfaces
 * - Mappers: Data transformation between Prisma models and domain entities
 * - External Services: Integrations with external systems (Stripe, emails, etc.)
 */

// Persistence
export * from './persistence';
