import {
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

export class InsufficientPermissionsException extends ForbiddenException {
  constructor(action: string, resource: string) {
    super(
      `Permissions insuffisantes pour effectuer l'action '${action}' sur la ressource '${resource}'`,
    );
  }
}

export class ResourceAlreadyExistsException extends ConflictException {
  constructor(resourceType: string, identifier: string) {
    super(`${resourceType} avec l'identifiant '${identifier}' existe déjà`);
  }
}

export class OperationNotAllowedException extends BadRequestException {
  constructor(operation: string, reason: string) {
    super(`Opération '${operation}' non autorisée: ${reason}`);
  }
}

export class BusinessRuleViolationException extends BadRequestException {
  constructor(rule: string, details?: string) {
    const message = details
      ? `Règle métier violée: ${rule}. Détails: ${details}`
      : `Règle métier violée: ${rule}`;
    super(message);
  }
}

export class ExternalServiceException extends BadRequestException {
  constructor(serviceName: string, error: string) {
    super(`Erreur du service externe '${serviceName}': ${error}`);
  }
}

export class DataIntegrityException extends ConflictException {
  constructor(details: string) {
    super(`Violation de l'intégrité des données: ${details}`);
  }
}

export class ConcurrentModificationException extends ConflictException {
  constructor(resourceType: string, resourceId: string) {
    super(
      `Modification concurrente détectée pour ${resourceType} avec l'ID '${resourceId}'. Veuillez rafraîchir et réessayer.`,
    );
  }
}
