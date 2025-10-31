import { UserAttribute } from '@prisma/client';

export interface UserAttributesObject {
  fitness: number;
  leadership: number;
  assessedBy?: string | null;
  assessedAt?: Date | null;
  notes?: string | null;
}

/**
 * Transforme un tableau d'attributs Prisma en objet simplifié
 * @param attributes - Tableau d'attributs depuis Prisma
 * @returns Objet avec fitness et leadership
 */
export function transformAttributesToObject(
  attributes: UserAttribute[],
): UserAttributesObject {
  const result: UserAttributesObject = {
    fitness: 1.0,
    leadership: 1.0,
  };

  attributes.forEach((attr) => {
    if (attr.attribute === 'FITNESS') {
      result.fitness = attr.value;
      result.assessedBy = attr.assessedBy;
      result.assessedAt = attr.assessedAt;
      result.notes = attr.notes;
    } else if (attr.attribute === 'LEADERSHIP') {
      result.leadership = attr.value;
      // Si on veut des métadonnées séparées pour leadership, on peut les ajouter ici
    }
  });

  return result;
}

/**
 * Récupère la valeur d'un attribut spécifique
 * @param attributes - Tableau d'attributs depuis Prisma
 * @param type - Type d'attribut (FITNESS ou LEADERSHIP)
 * @returns Valeur de l'attribut ou 1.0 par défaut
 */
export function getAttributeValue(
  attributes: UserAttribute[],
  type: 'FITNESS' | 'LEADERSHIP',
): number {
  const attr = attributes.find((a) => a.attribute === type);
  return attr?.value ?? 1.0;
}
