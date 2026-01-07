import { Injectable } from '@angular/core';
import { RedirectAfterLoginData } from '../../../features/auth/models/auth.model';
import { StorageKeysEnum } from '../../enums/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class LoginDataService {

  setAfterLoginData(data: RedirectAfterLoginData): void {
    localStorage.setItem(StorageKeysEnum.KEY_AFTER_LOGIN_STORAGE, JSON.stringify(data));
  }

  removeAfterLoginData(): void {
    localStorage.removeItem(StorageKeysEnum.KEY_AFTER_LOGIN_STORAGE);
  }

  getAfterLoginData(): RedirectAfterLoginData {
    const item = localStorage.getItem(StorageKeysEnum.KEY_AFTER_LOGIN_STORAGE);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }
}
