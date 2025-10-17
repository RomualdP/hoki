/**
 * Read Model for club list items
 * Optimized for list views, tables, and search results
 */
export interface ClubListReadModel {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  location: string | null;
  ownerId: string;
  createdAt: Date;

  // Summary data for list view
  memberCount: number;
  teamCount: number;
  subscriptionPlanName: string;
  subscriptionStatus: string;
}
