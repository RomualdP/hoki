"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Card, CardContent, Button } from "@/components/ui";
import { Input, Select } from "@/components/forms";
import { MATCH_STATUS_OPTIONS } from "../utils/match-status";

/**
 * MatchFiltersClient - Client Component
 *
 * Interactive filters for matches (search + status)
 * Updates URL searchParams for server-side filtering
 *
 * Pattern: Client Component for interactivity
 */
export function MatchFiltersClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const searchQuery = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.replace(`/matches?${params.toString()}`);
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("status", value);
      } else {
        params.delete("status");
      }
      router.replace(`/matches?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.replace("/matches");
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            id="search"
            name="search"
            label="Rechercher"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Équipe, lieu..."
            disabled={isPending}
          />

          <Select
            id="status"
            name="status"
            label="Statut"
            value={statusFilter}
            onChange={handleStatusChange}
            options={MATCH_STATUS_OPTIONS}
            disabled={isPending}
          />

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isPending}
              className="w-full"
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
