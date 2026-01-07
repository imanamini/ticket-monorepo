import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { LoggedInUser } from '../models/logged-in-user.model';
import { RefreshApiResponse } from '../models/refresh-api-response.model';
import { AuthenticationStorageService } from './authentication-storage.service';
import { LoginResponse } from '../models/login-response.model';
import { CacheService } from '../../../shared/services/cache.service';
import { AUTH_TOKEN_KEY } from '../../utils/variables';
import { LOGIN_ROUTE } from '../../../data-access/constants/app-routes';
import { environment } from '../../../data-access/environments/environment';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { checkWealthOrigin } from '../../utils/check-wealth-origin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public loggedInUser = new BehaviorSubject<LoggedInUser>(null);
  public userHasPassword = new BehaviorSubject<boolean>(false);

  /**
   *
   */
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  navigationService = inject(WealthNavigationService);

  constructor(
    private cache: CacheService,
    private baseApiService: BaseApiService,
    private authenticationStorageService: AuthenticationStorageService,
  ) {}

  getRefreshToken(): string {
    const key = localStorage.getItem(AUTH_TOKEN_KEY) || '';
    if (key) {
      const storage = JSON.parse(key);
      if (storage?.auth?.refresh) return storage?.auth?.refresh;
    }

    return '';
  }

  // ? Handle Refresh token
  postRefreshToken(): Observable<RefreshApiResponse> {
    return this.baseApiService.postAuth('users/token/refresh', {
      refreshToken: this.getRefreshToken(),
    });
  }

  login(params: any): Observable<LoginResponse> {
    return this.baseApiService.postAuth('users/login', params);
  }

  /**
   * State status
   * state 1: Case 401 in refresh token request.
   * state 2: Case 403, condition 1.
   * state 3: Case 403, condition 2.
   * state 4: Max refresh token tries in refreshJwtToken method.
   * state 5: Error of postRefresh token API in max refresh token tries.
   * state 6: Don't get user id.
   * state 7: Populate.
   * state 8: Layout tac confirmation.
   * state 9: Home mobile tac confirmation.
   */
  purgeAuth(navigateToLogin = true, sendEvent = false, state?: string) {
    // if (sendEvent) {
    //   const url = window.location.pathname;
    //   const hasPassword = this.userHasPassword.getValue();
    //   const cellNumber = this.loggedInUser.getValue()?.cellNumber;
    //   this.intrackEventService.intrackLogoutPerformanceEvent(
    //     url,
    //     Boolean(this.loggedInUser),
    //     cellNumber,
    //     hasPassword,
    //     state
    //   );
    // }
    this.cache.clean();
    this.loggedInUser.next(null);
    this.authenticationStorageService.removeToken();
    this.isAuthenticatedSubject.next(false);
    // TODO: check origin and if we are in .ir, redirect to login wealth
    const origin = window.location.origin;
    if (origin.includes('localhost')) {
      this.navigationService.navigate([LOGIN_ROUTE]);
    } else {
      if (navigateToLogin) {
        // hard reload, to make sure that every
        // state has been clean
        if (checkWealthOrigin() === 'wealth') {
          sessionStorage.setItem('redirectUrlAfterLogin', window.location.href);
        }
        window.location.replace(environment.supperAppLoginUrl);
      }
    }
  }
}
