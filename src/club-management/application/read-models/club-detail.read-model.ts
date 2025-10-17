/**
 * Read Model for detailed club information
 * Optimized for UI consumption (club detail pages, dashboards)
 */
export interface ClubDetailReadModel {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  location: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;

  // Aggregated data for UI
  memberCount?: number;
  teamCount?: number;
  activeSubscription?: {
    planId: string;
    planName: string;
    maxTeams: number | null;
    status: string;
  };
}
