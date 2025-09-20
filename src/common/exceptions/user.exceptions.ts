import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`Utilisateur avec l'ID ${userId} non trouvé`);
  }
}

export class UserEmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`Un utilisateur avec l'email ${email} existe déjà`);
  }
}

export class UserProfileNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`Profil utilisateur avec l'ID ${userId} non trouvé`);
  }
}

export class UserSkillNotFoundException extends NotFoundException {
  constructor(userId: string, skillId: string) {
    super(`Compétence ${skillId} non trouvée pour l'utilisateur ${userId}`);
  }
}

export class UserSkillAlreadyExistsException extends ConflictException {
  constructor(userId: string, skillId: string) {
    super(`L'utilisateur ${userId} possède déjà la compétence ${skillId}`);
  }
}

export class InvalidUserCredentialsException extends BadRequestException {
  constructor() {
    super('Identifiants utilisateur invalides');
  }
}
