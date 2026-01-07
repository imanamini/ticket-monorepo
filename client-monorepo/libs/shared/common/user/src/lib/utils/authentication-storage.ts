import { AuthenticationStorageInterface } from '../data-access/models/authentication-storage.interface';
import { AuthResponse } from '../data-access/models/auth-response.interface';

export class AuthenticationStorage {
  public static getRefreshToken(): string | null {
    const auth: string | null = localStorage.getItem('__dp_storage');
    const authObject: AuthenticationStorageInterface | null = auth ? JSON.parse(auth) : null;
    return authObject?.auth?.refresh || null;
  }

  public static getToken(): string | null {
    const auth: string | null = localStorage.getItem('__dp_storage');
    const authObject: AuthenticationStorageInterface | null = auth
      ? JSON.parse(auth)
      : {
          auth: {},
        };
    return authObject?.auth?.access || null;
  }

  public static updateAuth(response: AuthResponse): void {
    const auth = localStorage.getItem('__dp_storage');
    const authObject = auth ? JSON.parse(auth) : null;
    authObject.auth.access = response.accessToken;
    authObject.auth.refresh = response.refreshToken;
    localStorage.setItem('__dp_storage', JSON.stringify(authObject));
  }
}
