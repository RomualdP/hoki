import { useCallback, useState } from "react";
import { useApi } from "../../../shared/hooks/useApi";

export interface UserAttribute {
  id: string;
  userId: string;
  attribute: "FITNESS" | "LEADERSHIP";
  value: number;
  assessedBy?: string | null;
  assessedAt?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAttributes {
  fitness: number;
  leadership: number;
}

export interface UpdateUserAttributesData {
  fitness?: number;
  leadership?: number;
  notes?: string;
}

// Transform array of UserAttribute to simple object
const transformAttributes = (
  attributesArray: UserAttribute[],
): UserAttributes => {
  const result: UserAttributes = {
    fitness: 1.0,
    leadership: 1.0,
  };

  attributesArray.forEach((attr) => {
    if (attr.attribute === "FITNESS") {
      result.fitness = attr.value;
    } else if (attr.attribute === "LEADERSHIP") {
      result.leadership = attr.value;
    }
  });

  return result;
};

export const useUserAttributesApi = () => {
  const attributesApi = useApi<UserAttribute[]>();
  const [attributes, setAttributes] = useState<UserAttributes>({
    fitness: 1.0,
    leadership: 1.0,
  });

  const fetchUserAttributes = useCallback(
    async (userId: string) => {
      const data = await attributesApi.get(`/users/${userId}/attributes`);
      if (data) {
        const transformed = transformAttributes(data);
        setAttributes(transformed);
        return transformed;
      }
      return attributes;
    },
    [attributesApi],
  );

  const updateUserAttributes = useCallback(
    async (userId: string, updates: UpdateUserAttributesData) => {
      const data = await attributesApi.patch(
        `/users/${userId}/attributes`,
        updates,
      );
      if (data) {
        const transformed = transformAttributes(data);
        setAttributes(transformed);
        return transformed;
      }
      return attributes;
    },
    [attributesApi, attributes],
  );

  return {
    attributes,
    isLoading: attributesApi.isLoading,
    error: attributesApi.error,
    clearError: attributesApi.clearError,
    fetchUserAttributes,
    updateUserAttributes,
  };
};
