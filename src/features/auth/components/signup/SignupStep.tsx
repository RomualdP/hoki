/**
 * SignupStep Component (Atomic)
 *
 * Wrapper générique pour une étape de formulaire multi-step
 * Affiche le titre, la description et le contenu de l'étape
 */

import type { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../components/ui";

export interface SignupStepProps {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly stepNumber?: number;
  readonly totalSteps?: number;
}

export function SignupStep({
  title,
  description,
  children,
  stepNumber,
  totalSteps,
}: SignupStepProps) {
  return (
    <Card>
      <CardHeader>
        {stepNumber && totalSteps && (
          <div className="text-sm text-gray-500 mb-2">
            Étape {stepNumber} sur {totalSteps}
          </div>
        )}
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
