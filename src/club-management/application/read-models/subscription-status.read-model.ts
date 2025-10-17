/**
 * Read Model for subscription status
 * Optimized for subscription management UI
 */
export interface SubscriptionStatusReadModel {
  id: string;
  clubId: string;
  planId: string;
  planName: string;
  status: string; // 'ACTIVE' | 'INACTIVE' | 'PAST_DUE' | 'CANCELED'
  price: number;
  maxTeams: number | null;

  // Stripe data
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;

  // Period information
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;

  // Computed fields for UI
  isActive: boolean;
  isCanceled: boolean;
  remainingDays: number;
  formattedPrice: string; // "5,00 €" or "Gratuit"
  hasUnlimitedTeams: boolean;

  // Usage tracking
  currentTeamCount?: number;
  canCreateTeam?: boolean;
  teamsRemaining?: number | null; // null if unlimited
}
