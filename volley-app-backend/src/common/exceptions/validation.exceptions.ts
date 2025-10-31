import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class InvalidDataFormatException extends BadRequestException {
  constructor(field: string, expectedFormat: string) {
    super(
      `Format de données invalide pour le champ '${field}'. Format attendu: ${expectedFormat}`,
    );
  }
}

export class RequiredFieldMissingException extends BadRequestException {
  constructor(field: string) {
    super(`Le champ obligatoire '${field}' est manquant`);
  }
}

export class InvalidEmailFormatException extends BadRequestException {
  constructor() {
    super("Format d'email invalide");
  }
}

export class InvalidPasswordException extends BadRequestException {
  constructor(reason: string) {
    super(`Mot de passe invalide: ${reason}`);
  }
}

export class ValidationFailedException extends UnprocessableEntityException {
  constructor(errors: string[]) {
    super({
      message: 'Erreurs de validation',
      errors,
    });
  }
}

export class InvalidDateRangeException extends BadRequestException {
  constructor() {
    super(
      'Plage de dates invalide: la date de début doit être antérieure à la date de fin',
    );
  }
}

export class InvalidParameterException extends BadRequestException {
  constructor(parameter: string, value: string, allowedValues?: string[]) {
    const allowedText = allowedValues
      ? ` Valeurs autorisées: ${allowedValues.join(', ')}`
      : '';
    super(`Paramètre '${parameter}' invalide: '${value}'.${allowedText}`);
  }
}
