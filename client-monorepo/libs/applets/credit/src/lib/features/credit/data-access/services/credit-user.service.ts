import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CreditCacheService } from './credit-cache.service';
import { LoggedInUser } from './logged-in-user.model';
import { BaseApiService } from './base-api.service';
import { UserProfileResponse } from './tac.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CreditUserService {
  /**
   * Dispatches the  logged-in user's data
   */
  public loggedInUser = new BehaviorSubject<LoggedInUser | null>(null);

  constructor(
    private apiService: BaseApiService,
    private cache: CreditCacheService,
  ) {}

  getLoggedInUserDataFromApi(): void {
    this.getUserProfile().subscribe({
      next: (data) => {
        this.loggedInUser.next(data.userDetail);
      },
      error: () => {
        this.loggedInUser.next(null);
      },
    });
  }

  purgeAuth(navigateToLogin = true) {
    this.cache.clean();
    this.loggedInUser.next(null);
    ['jwtToken', 'refreshToken', 'user_id', '__dp_storage', '__storage_1', '__storage_mini_app_credit__'].forEach((key) => {
      localStorage.removeItem(key);
    });
    if (navigateToLogin) {
      // hard reload, to make sure that every
      // state has been clean
      window.location.replace('/auth/login');
    }
  }

  getUserData(): LoggedInUser | null {
    if (!this.loggedInUser) {
      return null;
    }

    return <LoggedInUser>this.loggedInUser.getValue();
  }

  clearLoggedInUser(): void {
    this.loggedInUser.next(null);
  }

  /**
   * I Really suggest to use this method for getting the
   * current user data (like cell number)
   *
   * There is some considerations and potential bugs in other methods.
   *
   */
  currentUser(): Promise<LoggedInUser> {
    return new Promise((resolve, reject) => {
      const user = this.getUserData();
      if (user) {
        resolve(user);
      } else {
        this.getUserProfile().subscribe({
          next: (data) => {
            this.loggedInUser.next(data.userDetail);
            resolve(data.userDetail);
          },
          error: () => {
            this.loggedInUser.next(null);
            reject(null);
          },
        });
      }
    });
  }

  getUserProfile(): Observable<UserProfileResponse> {
    return this.apiService.get('users/profile', undefined, new HttpHeaders()).pipe(
      map((data) => {
        return data;
      }),
    );
  }

  getUserId(): string {
    const dps = localStorage.getItem('__dp_storage');
    if (dps && dps !== 'undefined' && dps !== 'null') {
      try {
        const dpsJson = JSON.parse(dps);
        if (dpsJson?.auth?.userId) {
          return dpsJson.auth.userId;
        }
      } catch (e) {
        console.error('Failed to parse DB_STORAGE:', e);
      }
    }

    const dpUserId = localStorage.getItem('__dp_userId');
    if (dpUserId && dpUserId !== 'undefined') {
      try {
        return JSON.parse(dpUserId);
      } catch (e) {
        console.error('Failed to parse USER_ID_STORAGE_KEY:', e);
        // If it's already a plain string userId, return it directly
        return dpUserId;
      }
    }

    return '';
  }
}
