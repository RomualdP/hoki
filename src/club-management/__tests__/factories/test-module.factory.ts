import { Test, TestingModule } from '@nestjs/testing';
import { Type } from '@nestjs/common';

/**
 * Factory to simplify NestJS test module setup
 *
 * Reduces boilerplate when creating test modules for handlers
 *
 * Usage:
 * ```typescript
 * const { handler, module } = await TestModuleFactory.createForHandler(
 *   CreateClubHandler,
 *   [
 *     { provide: CLUB_REPOSITORY, useValue: mockClubRepository },
 *   ]
 * );
 * ```
 */
export class TestModuleFactory {
  /**
   * Create a test module for a handler with dependencies
   *
   * @param handlerClass - The handler class to instantiate
   * @param dependencies - Array of provider configurations
   * @returns Object containing the handler instance and module
   */
  static async createForHandler<T>(
    handlerClass: Type<T>,
    dependencies: Array<{
      provide: symbol | string | Type<any>;
      useValue: any;
    }>,
  ): Promise<{ handler: T; module: TestingModule }> {
    const module: TestingModule = await Test.createTestingModule({
      providers: [handlerClass, ...dependencies],
    }).compile();

    const handler = module.get<T>(handlerClass);

    return { handler, module };
  }

  /**
   * Create a test module for a domain service with dependencies
   *
   * @param serviceClass - The service class to instantiate
   * @param dependencies - Array of provider configurations
   * @returns Object containing the service instance and module
   */
  static async createForService<T>(
    serviceClass: Type<T>,
    dependencies: Array<{
      provide: symbol | string | Type<any>;
      useValue: any;
    }>,
  ): Promise<{ service: T; module: TestingModule }> {
    const module: TestingModule = await Test.createTestingModule({
      providers: [serviceClass, ...dependencies],
    }).compile();

    const service = module.get<T>(serviceClass);

    return { service, module };
  }
}
