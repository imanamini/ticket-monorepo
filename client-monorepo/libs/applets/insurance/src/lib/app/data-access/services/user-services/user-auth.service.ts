import { inject, Injectable } from '@angular/core';
import { MemoryCacheService } from '@digipay/ng-lib-memory-cache';
import { NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AuthModel, AuthModelItem } from '../../../features/auth/models/auth.model';
import { SharedUserSourceService } from './shared-user-source.service';
import { StorageKeysEnum } from '../../enums/storage-keys.enum';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})

export class UserAuthService {

  private cache = inject(MemoryCacheService);
  private sharedUserSourceService = inject(SharedUserSourceService);
  private loginService = inject(LoginService);

  private authTokenSource: BehaviorSubject<AuthModelItem> = new BehaviorSubject<AuthModelItem>(null);

  public get getAuthToken(): AuthModelItem {
    return this.authTokenSource.getValue();
  }

  initAuth(): void {
    try {
      const auth = this.getStorageAuthToken();
      if (auth) {
        const token = auth.auth.access;
        const refreshToken = auth.auth.refresh;
        const userId = auth.auth.userId;
        this.storeAuthTokenToStorage(
          {
            accessToken: token,
            refreshToken,
            userId
          }
        );
      }
    } catch (e) {
      this.clearAuthStorage();
    }
  }

  getStorageAuthToken(): AuthModel | null {
    const item = localStorage.getItem(StorageKeysEnum.KEY_NAME_AUTH_STORAGE);
    try {
      return JSON.parse(item) as AuthModel;
    } catch (e) {
      return null;
    }
  }

  setAuthToken(model: AuthModelItem): void {
    const item: AuthModel = {
      auth: {
        access: model.access,
        refresh: model.refresh,
        userId: model.userId,
        expirationTime: null
      }
    };
    localStorage.setItem(StorageKeysEnum.KEY_NAME_AUTH_STORAGE, JSON.stringify(item));
  }

  storeAuthTokenToStorage(loginResponse: { accessToken: string, refreshToken: string, userId: string }): void {
    const item: AuthModelItem = {
      userId: loginResponse?.userId,
      refresh: loginResponse.refreshToken,
      access: loginResponse?.accessToken
    };
    this.setAuthToken(item);
    this.authTokenSource.next(item);
    this.sharedUserSourceService.isLoggedInSource.next(true);
  }

  clearAuthStorage(): void {
    this.removeAuthToken();
    this.cache.clean();
  }

  purgeAuth(navigateToLogin = true): void {
    this.removeAuthToken();
    this.cache.clean();
    this.sharedUserSourceService.isLoggedInSource.next(false);
    this.authTokenSource.next(null);
    if (navigateToLogin) {
      this.loginService.routeToLoginPage();
    }
  }

  removeAuthToken(): void {
    localStorage?.removeItem(StorageKeysEnum.KEY_NAME_AUTH_STORAGE);
  }

  setAppToken(accessToken: string, refreshToken: string): void {
    const auth = this.getStorageAuthToken();
    auth.auth.access = accessToken;
    this.storeAuthTokenToStorage({
      accessToken,
      refreshToken,
      userId: auth.auth.userId
    });
  }
}
