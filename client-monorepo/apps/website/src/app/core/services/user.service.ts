import { afterNextRender, Inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

import { User } from '../../api/digipay/models/user.model';
import { LoginResponse } from '../../api/digipay/models/login-response.model';
import { MemoryCacheService } from '@digipay/ng-lib-memory-cache';
import { LoggedInUser } from '../../api/digipay/models/logged-in-user.model';
import { MessageService } from '@client-monorepo/common/utilities';
import { FatalErrorService } from './fatal-error.service';
import { UserProfileResponse } from '../../api/digipay/models/user-profile.response';
import { UserApiService } from '../../api/digipay/user-api.service';
import { StorageSchema } from '../models/storage-schema';
import { InMemoryStorage, StorageInterface } from '@digipay/ng-storage';
import { BaseHttpClient } from '../../api/base-http-client';
import { ImageApiService } from '../../api/digipay/image-api.service';
import { UserProfile } from '../../api/digipay/models/profile/UserProfile';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from './token.service';
import { WebViewService } from './web-view.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * After login
   */
  public afterLoginData = new BehaviorSubject<{
    url: string;
    queryParams: any;
  }>({
    url: '/',
    queryParams: {},
  });
  /**
   * Dispatches the login event
   */
  public afterLogin = new Subject<boolean>();
  /**
   * Dispatches the logged-in user's data
   */
  public loggedInUser = new BehaviorSubject<LoggedInUser>(null);
  public profileImageUrl = new BehaviorSubject<string>(null);
  isLoggedIn = new BehaviorSubject(false);
  redirectUrlAfterLogin = '';

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);

  isopenDialog = false;

  constructor(
    @Inject('StorageInterface') public storage: StorageInterface<StorageSchema>,
    @Inject('InMemoryStorageService')
    public inMemoryStorageService: InMemoryStorage<StorageSchema>,
    private apiService: BaseHttpClient,
    private cache: MemoryCacheService,
    private messageService: MessageService,
    private fatalErrorService: FatalErrorService,
    private userApi: UserApiService,
    private imageApiService: ImageApiService,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private tokenService: TokenService,
    private webViewService: WebViewService,
  ) {
    this.apiService.api = 'digipay';
    afterNextRender(() => {
      this.isAuthenticatedSubject.subscribe((isAuthenticated) => {
        if (isAuthenticated && !this.loggedInUser.getValue()) {
          this.getLoggedInUserDataFromApi();
        } else {
          this.loggedInUser.next(null);
        }
      });
      const hasAccess = !!this.tokenService.getAccessToken();
      this.isLoggedIn.next(hasAccess);
    });
  }

  populate() {
    this.setAccessToken()
      .then(() => {
        this.isAuthenticatedSubject.next(true);
      })
      .catch(() => {
        this.purgeAuth();
      });
  }

  setAccessToken(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // check url
      this.activatedRoute.queryParams.subscribe((params) => {
        if (params.token) {
          this.tokenService.setTokens(params.token, '');
          resolve(true);
        }
      });

      // check webview
      if (this.webViewService.isWebView()) {
        const setTokenFn = (newToken: string) => {
          this.ngZone.run(() => {
            if (newToken) {
              const token = newToken.trim();
              this.tokenService.setTokens(token, '');
              this.isLoggedIn.next(true);
              resolve(true);
            }
            reject();
          });
        };

        setTokenFn.bind(this);

        this.webViewService.onSetAuthToken(setTokenFn);

        this.webViewService.getToken();
      }

      // check storage
      if (this.tokenService.haveTokens()) {
        resolve(true);
      }
    });
  }

  getLoggedInUserDataFromApi(): void {
    const accessToken = this.tokenService.getAccessToken();
    if (accessToken) {
      this.apiService.getUserProfile().subscribe(
        (data) => {
          this.loggedInUser.next(data.userDetail);
          if (data.userDetail.imageId) {
            this.getProfileImageBase64String(data.userDetail.imageId).then((imageBase64) => {
              this.profileImageUrl.next(imageBase64);
            });
          }
        },
        (e) => {
          if (this.messageService.hasMessage(e)) {
            this.fatalErrorService.setError(e.result.message);
            this.messageService.showErrorMessage(e.result.message);
          }
        },
      );
    }
  }

  public getProfileImageBase64String(imageId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.imageApiService.getImage(imageId).subscribe(
        (data) => {
          const blob = new Blob([data as Blob], {
            type: 'application/octet-stream',
          });
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const str = fileReader.result as string;
            resolve(str);
          };
          fileReader.readAsDataURL(blob);
        },
        (e) => {
          reject(e);
        },
      );
    });
  }

  setAuth(loginResponse: { accessToken: string; refreshToken: string; userId: string }) {
    this.tokenService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
    this.storeUserId(loginResponse.userId);
    this.isAuthenticatedSubject.next(true);
  }

  storeUserId(userId) {
    if (userId) {
      this.storage.patch({
        auth: {
          userId: userId,
        },
      });
    }
  }

  getUserId() {
    return new Promise((resolve) => {
      const userId = this.storage.get('auth.userId', '');
      resolve(userId);
    });
  }

  purgeAuth() {
    this.cache.clean();
    this.loggedInUser.next(null);
    this.tokenService.clearTokens();
    this.storage.remove('auth.userId');
    this.isAuthenticatedSubject.next(false);
  }

  getUserData(): LoggedInUser {
    if (!this.loggedInUser) {
      return null;
    }

    return this.loggedInUser.getValue();
  }

  postRefreshToken(): Observable<User> {
    const refreshToken = this.tokenService.getRefreshToken();

    return this.apiService.post('users/token/refresh', {
      refreshToken: refreshToken,
    });
  }

  login(params): Observable<LoginResponse> {
    return this.apiService.post('users/login', params);
  }

  logout(hardReload = false, path = ''): void {
    this.clearState();
    if (!hardReload) {
      window.location.reload();
    } else {
      const url = window.location.pathname + path;
      window.location.replace(url);
    }
    this.cache.clean();
  }

  /**
   * I Really suggest using this method for getting the
   * current user data (like cell number)
   *
   * There are some considerations and potential bugs in other methods.
   *
   */
  currentUser(): Promise<LoggedInUser> {
    return new Promise((resolve) => {
      const user = this.getUserData();
      if (user) {
        resolve(user);
      } else {
        this.getLoggedInUserDataFromApi();
        this.loggedInUser.asObservable().subscribe((user) => {
          if (user) {
            resolve(user);
          }
        });
      }
    });
  }

  clearAfterLoginData() {
    this.afterLoginData.next({
      url: '',
      queryParams: {},
    });
  }

  getUserDataFromApi(): Observable<UserProfileResponse> {
    return this.userApi.getUserData();
  }

  getCellNumber(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getUserDataFromApi().subscribe(
        (res) => {
          resolve(res.userDetail.cellNumber);
        },
        (e) => {
          reject(e);
        },
      );
    });
  }

  clearState(): void {
    this.storage.clear();
    this.inMemoryStorageService.clear();
    this.isLoggedIn.next(false);
  }

  updateUserProfile(params: { name?: string; surname?: string }): Observable<UserProfile> {
    return this.apiService.put('users/profile', params);
  }

  emitUserProfile(profile: LoggedInUser) {
    this.loggedInUser.next(profile);
  }
}
