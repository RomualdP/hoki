import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly message?: string;
  readonly meta?: Record<string, unknown>;
}

interface PaginatedData {
  readonly data: unknown[];
  readonly meta: Record<string, unknown>;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<unknown>> {
    return next.handle().pipe(
      map((data: unknown) => {
        // Si la réponse a déjà le format { success, data, message }, on la retourne telle quelle
        if (data && typeof data === 'object' && 'success' in data) {
          return data as Response<unknown>;
        }

        // Si la réponse a le format { data, meta } (comme pour les listes paginées)
        if (this.isPaginatedData(data)) {
          return {
            success: true,
            data: data.data,
            meta: data.meta,
            message: 'Opération réussie',
          };
        }

        // Pour toute autre réponse, on l'encapsule dans le format standard
        return {
          success: true,
          data,
          message: 'Opération réussie',
        };
      }),
    );
  }

  private isPaginatedData(data: unknown): data is PaginatedData {
    return (
      data !== null &&
      typeof data === 'object' &&
      'data' in data &&
      'meta' in data &&
      Array.isArray((data as PaginatedData).data)
    );
  }
}
