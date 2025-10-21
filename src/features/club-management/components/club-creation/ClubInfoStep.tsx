/**
 * ClubInfoStep Component (Dumb)
 *
 * Displays club information form fields
 * Pure presentation component - receives all data via props
 */

import { Input } from "../../../../components/forms";

export interface ClubInfoStepProps {
  readonly name: string;
  readonly description: string;
  readonly onNameChange: (value: string) => void;
  readonly onDescriptionChange: (value: string) => void;
  readonly errors?: {
    readonly name?: string;
    readonly description?: string;
  };
  readonly disabled?: boolean;
}

export function ClubInfoStep({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  errors,
  disabled = false,
}: ClubInfoStepProps) {
  return (
    <div className="space-y-4">
      {/* Club Name */}
      <Input
        id="clubName"
        name="clubName"
        type="text"
        label="Nom du club"
        placeholder="Ex: Volley Club Paris"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        error={errors?.name}
        required
        disabled={disabled}
      />

      {/* Club Description */}
      <div className="space-y-2">
        <label
          htmlFor="clubDescription"
          className="block text-sm font-medium text-gray-700"
        >
          Description (optionnel)
        </label>
        <textarea
          id="clubDescription"
          name="clubDescription"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Décrivez votre club..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          disabled={disabled}
        />
        {errors?.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>
    </div>
  );
}
