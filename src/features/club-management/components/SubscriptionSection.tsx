"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { SubscriptionWidget } from "@/features/dashboard/components";

/**
 * SubscriptionSection - Dumb Component
 *
 * Subscription section for coaches
 * Props-based, no state, no effects
 *
 * Pattern: Dumb component (max 80 lines)
 */
export function SubscriptionSection() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Mon Abonnement</CardTitle>
      </CardHeader>
      <CardContent>
        <SubscriptionWidget />
      </CardContent>
    </Card>
  );
}
