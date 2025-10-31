/**
 * Read Model for subscription plan information
 * Optimized for plan selection UI
 */
export interface SubscriptionPlanReadModel {
  id: string;
  name: string;
  description: string;
  price: number;
  maxTeams: number | null;
  features: string[];

  // Computed fields for UI
  formattedPrice: string; // "5,00 €/mois" or "Gratuit"
  isFree: boolean;
  hasUnlimitedTeams: boolean;
  isRecommended?: boolean; // UI flag for highlighting
  stripePriceId?: string; // For Stripe integration
}
