/**
 * InvitationLinkGenerator Component (Smart)
 *
 * Handles invitation link generation and display
 * Mobile-first design with clear CTAs
 */

"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "../../../../components/ui";
import { Select } from "../../../../components/forms/Select";
import { CopyLinkButton } from "./CopyLinkButton";
import { useInvitation } from "../../hooks";
import type { InvitationType } from "../../types";

export interface InvitationLinkGeneratorProps {
  readonly clubId: string;
}

export function InvitationLinkGenerator({
  clubId,
}: InvitationLinkGeneratorProps) {
  const { generateInvitation, buildInvitationUrl, isLoading, error } =
    useInvitation();

  const [invitationType, setInvitationType] =
    useState<InvitationType>("PLAYER");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  /**
   * Handle link generation
   */
  const handleGenerate = async () => {
    try {
      const { token } = await generateInvitation({
        clubId,
        type: invitationType,
        expiresInDays: 7, // Default 7 days expiry
      });

      const url = buildInvitationUrl(token, invitationType);
      setGeneratedLink(url);
    } catch (err) {
      console.error("Failed to generate invitation:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inviter des membres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Invitation Type Selector */}
        <div>
          <Select
            id="invitationType"
            name="invitationType"
            label="Type d'invitation"
            value={invitationType}
            onChange={(e) =>
              setInvitationType(e.target.value as InvitationType)
            }
            options={[
              {
                value: "PLAYER",
                label: "Joueur",
              },
              {
                value: "ASSISTANT_COACH",
                label: "Assistant Coach",
              },
            ]}
            disabled={isLoading}
          />
          <p className="mt-2 text-sm text-gray-500">
            {invitationType === "PLAYER"
              ? "Les joueurs pourront rejoindre vos équipes"
              : "Les assistants pourront gérer les équipes avec vous"}
          </p>
        </div>

        {/* Generate Button */}
        {!generatedLink && (
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full min-h-[44px]"
          >
            {isLoading ? "Génération..." : "Générer le lien d'invitation"}
          </Button>
        )}

        {/* Generated Link */}
        {generatedLink && (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                {`Lien d'invitation généré !`}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Ce lien expire dans 7 jours
              </p>
            </div>

            <CopyLinkButton
              invitationUrl={generatedLink}
              disabled={isLoading}
            />

            {/* Generate New Link */}
            <Button
              variant="outline"
              onClick={() => {
                setGeneratedLink(null);
              }}
              disabled={isLoading}
              className="w-full"
            >
              Générer un nouveau lien
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
