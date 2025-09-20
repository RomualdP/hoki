import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface ErrorResponse {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: string;
    readonly timestamp: string;
    readonly path: string;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = 'UNKNOWN_ERROR';
    let message: string = 'Une erreur inconnue est survenue';
    let details: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = this.translateHttpMessage(exceptionResponse);
        code = this.getErrorCode(status);
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = this.translateHttpMessage(
          Array.isArray(responseObj.message)
            ? (responseObj.message[0] as string)
            : (responseObj.message as string) || exception.message,
        );
        code = this.getErrorCode(status);
        details =
          Array.isArray(responseObj.message) && responseObj.message.length > 1
            ? responseObj.message.join(', ')
            : undefined;
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      const prismaError = this.handlePrismaError(exception);
      status = prismaError.status;
      code = prismaError.code;
      message = prismaError.message;
      details = prismaError.details;
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 'INTERNAL_SERVER_ERROR';
      message = 'Une erreur interne du serveur est survenue';
      details = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 'UNKNOWN_ERROR';
      message = 'Une erreur inconnue est survenue';
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    // Log de l'erreur pour le debugging
    this.logger.error(
      `${code} - ${message}`,
      exception instanceof Error ? exception.stack : exception,
      `${request.method} ${request.url}`,
    );

    response.status(status).json(errorResponse);
  }

  private translateHttpMessage(message: string): string {
    // Messages standard NestJS traduits en français
    const translations: Record<string, string> = {
      Unauthorized: 'Accès non autorisé',
      Forbidden: 'Accès interdit',
      'Not Found': 'Ressource non trouvée',
      'Bad Request': 'Requête invalide',
      Conflict: 'Conflit de données',
      'Unprocessable Entity': 'Données non valides',
      'Internal Server Error': 'Erreur interne du serveur',
      'Service Unavailable': 'Service indisponible',
      'Gateway Timeout': "Délai d'attente dépassé",
    };

    // Si le message contient déjà du français ou est personnalisé, on le garde
    if (
      message.includes('avec') ||
      message.includes('trouvé') ||
      message.includes('ID')
    ) {
      return message;
    }

    return translations[message] || message;
  }

  private getErrorCode(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      500: 'INTERNAL_SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT',
    };

    return codes[status] || 'UNKNOWN_ERROR';
  }

  private handlePrismaError(error: PrismaClientKnownRequestError): {
    status: number;
    code: string;
    message: string;
    details: string;
  } {
    switch (error.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          code: 'DUPLICATE_ENTRY',
          message: 'Cette valeur existe déjà',
          details: `Conflit sur le champ: ${String(error.meta?.target)}`,
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          code: 'RECORD_NOT_FOUND',
          message: 'Enregistrement non trouvé',
          details:
            (error.meta?.cause as string) ||
            "L'enregistrement demandé n'existe pas",
        };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          code: 'FOREIGN_KEY_CONSTRAINT',
          message: 'Contrainte de clé étrangère violée',
          details: 'Cette opération viole une contrainte de référence',
        };
      case 'P2021':
        return {
          status: HttpStatus.BAD_REQUEST,
          code: 'TABLE_NOT_EXISTS',
          message: 'Table non trouvée',
          details: "La table demandée n'existe pas dans la base de données",
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          code: 'DATABASE_ERROR',
          message: 'Erreur de base de données',
          details: error.message,
        };
    }
  }
}
