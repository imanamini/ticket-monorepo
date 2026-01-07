import { Inject, Injectable } from '@angular/core';
import { StorageInterface } from '@digipay/ng-storage';
import { StorageSchema } from '../models/storage-schema';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(
    @Inject('StorageInterface') public storage: StorageInterface<StorageSchema>,
  ) {}

  setTokens(accessToken: string, refreshToken: string) {
    this.storage.patch({
      auth: {
        access: accessToken,
        refresh: refreshToken,
      },
    });
  }

  getAccessToken(): string {
    return this.storage.get('auth.access', '');
  }

  getRefreshToken(): string {
    return this.storage.get('auth.refresh', '');
  }

  clearTokens(): void {
    this.storage.remove('auth.access');
    this.storage.remove('auth.refresh');
  }

  haveTokens(): boolean {
    return !!(this.storage.get('auth.access', '') && this.storage.get('auth.refresh', ''));
  }
}
