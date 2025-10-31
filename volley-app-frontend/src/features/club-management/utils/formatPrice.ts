/**
 * Format Price Utility
 *
 * Utility function to format prices from cents to euros
 */

/**
 * Format a price from cents to euros with proper formatting
 *
 * @param priceInCents - Price in cents (e.g., 500 for 5€)
 * @param locale - Locale for formatting (default: 'fr-FR')
 * @returns Formatted price string (e.g., "5,00 €")
 *
 * @example
 * formatPrice(0) // "Gratuit"
 * formatPrice(500) // "5,00 €"
 * formatPrice(1500) // "15,00 €"
 * formatPrice(999) // "9,99 €"
 */
export function formatPrice(
  priceInCents: number,
  locale: string = "fr-FR",
): string {
  // Handle free plan
  if (priceInCents === 0) {
    return "Gratuit";
  }

  // Convert cents to euros
  const priceInEuros = priceInCents / 100;

  // Format with Intl.NumberFormat for proper localization
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInEuros);
}

/**
 * Format a price for display with frequency
 *
 * @param priceInCents - Price in cents
 * @param frequency - Payment frequency (e.g., "/mois", "/an")
 * @param locale - Locale for formatting
 * @returns Formatted price string with frequency
 *
 * @example
 * formatPriceWithFrequency(500, "/mois") // "5,00 €/mois"
 * formatPriceWithFrequency(0, "/mois") // "Gratuit"
 */
export function formatPriceWithFrequency(
  priceInCents: number,
  frequency: string = "/mois",
  locale: string = "fr-FR",
): string {
  const formattedPrice = formatPrice(priceInCents, locale);

  // Don't add frequency to "Gratuit"
  if (priceInCents === 0) {
    return formattedPrice;
  }

  return `${formattedPrice}${frequency}`;
}
