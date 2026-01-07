/**
 * Simple static environment service
 * Usage: import { EnvironmentService } from '@client-monorepo/app-core';
 * Then: EnvironmentService.env.base_url
 */
export class EnvironmentService {
  private static _env: any;

  static get env(): any {
    return this._env;
  }

  static setEnvironment(environment: any): void {
    this._env = environment;
  }
}
