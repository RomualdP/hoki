/**
 * ClubChangeWarning Component (Atomic)
 *
 * Warning modal when a player is changing clubs
 * Explains they will lose access to their previous club
 */

import { Button } from "../../../../components";
import { SignupStep } from "./SignupStep";

export interface ClubChangeWarningProps {
  readonly newClubName: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ClubChangeWarning({
  newClubName,
  onConfirm,
  onCancel,
}: ClubChangeWarningProps) {
  return (
    <SignupStep title="Attention : Changement de club">
      <div className="space-y-4">
        {/* Warning Message */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800">
                Vous appartenez déjà à un club
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  En rejoignant <strong>{newClubName}</strong>, vous quitterez
                  automatiquement votre club actuel.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>{`Vous perdrez l'accès aux données de votre ancien club`}</li>
                  <li>{`Votre historique de matchs sera conservé`}</li>
                  <li>{`Vos statistiques personnelles seront transférées`}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Question */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Souhaitez-vous continuer et rejoindre <strong>{newClubName}</strong>{" "}
            ?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 min-h-[44px]"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1 min-h-[44px]"
            onClick={onConfirm}
          >
            Confirmer le changement
          </Button>
        </div>
      </div>
    </SignupStep>
  );
}
