/**
 * CopyLinkButton Component (Dumb)
 *
 * Button to copy invitation link to clipboard
 * Pure presentation component with minimal state
 */

"use client";

import { useState } from "react";
import { Button } from "../../../../components/ui";

export interface CopyLinkButtonProps {
  readonly invitationUrl: string;
  readonly disabled?: boolean;
}

export function CopyLinkButton({
  invitationUrl,
  disabled = false,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-3">
      {/* Invitation URL Display */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <input
          type="text"
          value={invitationUrl}
          readOnly
          className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
        />
      </div>

      {/* Copy Button - Touch friendly on mobile */}
      <Button
        variant="outline"
        onClick={handleCopy}
        disabled={disabled}
        className="w-full min-h-[44px]"
      >
        {copied ? (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Copié !
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copier le lien
          </>
        )}
      </Button>
    </div>
  );
}
