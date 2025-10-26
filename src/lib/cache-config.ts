/**
 * Cache Configuration
 *
 * Centralized cache revalidation settings for Next.js Data Cache
 *
 * NOTE: Even though cookies() forces dynamic rendering (no Full Route Cache),
 * we can still use the Data Cache for fetch requests with revalidate.
 *
 * This means:
 * - Pages are rendered dynamically (user-specific, filters, etc.)
 * - BUT data from API is cached and revalidated after specified duration
 * - Significant performance improvement without losing dynamic features
 */

/**
 * Short cache duration (1 minute)
 * Use for: User-specific data that changes frequently
 * Examples: invitations, notifications, user preferences
 */
export const REVALIDATE_SHORT = 60;

/**
 * Medium cache duration (5 minutes)
 * Use for: Shared data that changes moderately
 * Examples: matches, teams, clubs, players
 */
export const REVALIDATE_MEDIUM = 300;

/**
 * Long cache duration (1 hour)
 * Use for: Static/semi-static data that rarely changes
 * Examples: skill categories, achievement types, app configuration
 */
export const REVALIDATE_LONG = 3600;

/**
 * No cache
 * Use for: Real-time data or security-sensitive data
 * Examples: authentication state, payment status
 */
export const NO_CACHE = "no-store" as const;
