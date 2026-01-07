import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth-response.interface';
import { AuthenticationStorageInterface } from '../models/authentication-storage.interface';
import { AUTH_TOKEN_KEY } from '../../utils/variables';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationStorageService {
  authObject: AuthenticationStorageInterface | null = null;

  constructor() {
    this.authObject = this.getAuthObject();
  }

  public getRefreshToken(): string | null {
    return this.authObject?.auth?.refresh || null;
  }

  public getAccessToken(): string | null {
    return this.authObject?.auth?.access || null;
  }

  private getExpirationTime(): number {
    return this.authObject?.auth?.expirationTime || 0;
  }

  public setUserId(userId: string): void {
    this.setAuthObjectElm('userId', userId);
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(this.authObject));
  }

  private generateRefreshingTime(expireIn: number): number {
    const now = new Date();
    return Number(new Date(now.getTime() + expireIn * 1000));
  }

  public isTokenExpired(): boolean {
    const currentTime = new Date().getTime() + 10 * 1000;
    return currentTime > this.getExpirationTime();
  }

  private initiateAuth(
    authObject: AuthenticationStorageInterface,
    response: AuthResponse,
  ) {
    authObject = {
      auth: {
        access: response.accessToken,
        refresh: response.refreshToken,
        expirationTime: this.generateRefreshingTime(response.expireIn),
      },
    };
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authObject));
    this.authObject = authObject;
  }

  public getUserId(): string | null {
    const authObject = this.getAuthObject();
    return authObject?.auth?.userId || null;
  }

  public updateAuth(response: AuthResponse): void {
    if (!Object(this.authObject).auth) {
      this.initiateAuth(Object(this.authObject), response);
      return;
    }
    Object(this.authObject).auth.access = response.accessToken;
    Object(this.authObject).auth.refresh = response.refreshToken;
    Object(this.authObject).auth.expirationTime = this.generateRefreshingTime(
      response.expireIn,
    );
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(this.authObject));
  }

  public removeToken(): void {
    // ? Delete auth object
    delete Object(this.authObject).auth;
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(this.authObject));
  }

  private getAuthObject(): AuthenticationStorageInterface | null {
    const auth: string | null = localStorage.getItem(AUTH_TOKEN_KEY);
    return auth ? JSON.parse(auth) : {};
  }

  private setAuthObjectElm(key: string, value: string) {
    if (this.authObject) {
      this.authObject.auth = {...this.authObject.auth, [key]: value};
    }
  }
}
