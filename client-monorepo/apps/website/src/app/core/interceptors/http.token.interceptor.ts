import {
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
} from '@angular/common/http';
import { Inject, Injectable, InjectionToken, NgZone } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { API_CONSTANTS } from '../constants';
import { InMemoryStorage, StorageInterface } from '@digipay/ng-storage';
import { StorageSchema } from '../models/storage-schema';
import { environment } from '../../../environments/environment';
import { User } from '../../api/digipay/models/user.model';
import { GenericApiResponse } from '../../api/digipay/models/generic-api-response.model';
import { TokenService } from '../services/token.service';
import { WebViewService } from '../services/web-view.service';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

declare const window: any;

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  tokenSubject: ReplaySubject<string> = new ReplaySubject(1);
  isRefreshingToken: boolean;
  isGettingPassword = false;
  userId: any = '';
  private refreshTokenTries = 0;
  private maxRefreshTries = 3;

  constructor(
    @Inject('StorageInterface') public storage: StorageInterface<StorageSchema>,
    @Inject('InMemoryStorageService')
    public inMemoryStorageService: InMemoryStorage<StorageSchema>,
    private userService: UserService,
    @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number,
    private ngZone: NgZone,
    private tokenService: TokenService,
    private webViewService: WebViewService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
    const accessToken = this.tokenService.getAccessToken();
    return next.handle(this.addRequiredHeaders(req, accessToken)).pipe(
      catchError((e) => {
        const errorBody: GenericApiResponse = e.error || null;
        switch (e.status) {
          case 401:
            if (!this.isRefreshingToken && !this.isGettingPassword) {
              this.refreshJwtToken();
            } else if (!errorBody && this.isRefreshTokenRequest(req)) {
              this.userService.purgeAuth();
            } else if (e.status === 401 && e.error && e.error.result && e.error.result.status === 2008) {
              // wrong username or password,
              // throw error to handle it inside the components
              return throwError(e);
            } else {
              this.flushSession();
            }
            return;
          case 403:
            if (errorBody && errorBody.result) {
            }
            break;
        }

        return throwError(e);
      }),
    );
  }

  refreshJwtToken() {
    this.isRefreshingToken = true;
    this.refreshTokenTries += 1;
    if (this.refreshTokenTries > this.maxRefreshTries) {
      this.userService.purgeAuth();
      return;
    }

    // signal client
    if (this.webViewService.isWebView()) {
      this.getNewTokenFromHost();
    } else {
      this.userService.postRefreshToken().subscribe(
        (user: User) => {
          if (user) {
            this.isRefreshingToken = false;
            this.refreshTokenTries = 0;
            this.userService.setAuth(user);
            this.tokenSubject.next(user.accessToken);
          }
        },
        (e) => {
          this.isRefreshingToken = false;
          if (this.refreshTokenTries > this.maxRefreshTries) {
            this.userService.purgeAuth();
          }
        },
      );
    }
  }

  isRefreshTokenRequest(request: HttpRequest<any>): boolean {
    return request.url.indexOf('/refresh') >= 0;
  }

  private flushSession(): void {
    this.userService.logout(true);
  }

  private addRequiredHeaders(req: HttpRequest<any>, accessToken: string = null): HttpRequest<any> {
    let headers = req.headers;
    // Add common API headers
    if (-1 === req.url.search(environment.intrackRestConfig.host)) {
      headers = headers
        .append('Agent', API_CONSTANTS.HTTP_AGENT)
        .append('Digipay-Version', environment.api_core.version)
        .append('Client-Version', '1.0.0');
    }

    // ticket is not available
    // so access token might be available
    if (accessToken) {
      if (req.headers.keys().indexOf('Authorization') < 0 && req.headers.keys().indexOf('ticket') < 0) {
        headers = headers.set('Authorization', 'Bearer ' + accessToken);
      }
    } else {
      // if accessToken is not available, we might try Basic Auth parameters
      if (req.headers.keys().indexOf('ticket') < 0) {
        const basicAuth = btoa(environment.api_core.username + ':' + environment.api_core.password);
        headers = headers.set('Authorization', 'Basic ' + basicAuth);
      }
    }

    return req.clone({
      headers,
    });
  }

  private getNewTokenFromHost(): void {
    this.webViewService.tokenExpired();

    const setTokenFunc = (accessToken: string) => {
      // Store the new token
      this.isRefreshingToken = false;
      this.refreshTokenTries = 0;
      this.tokenSubject.next(accessToken);
      this.tokenService.setTokens(accessToken, '');
    };

    setTokenFunc.bind(this);

    this.webViewService.onSetAuthToken((accessToken: string) => {
      this.ngZone.run(() => {
        if (accessToken) {
          setTokenFunc(accessToken.trim());
        }
      });
    });

    this.webViewService.getToken();
  }
}
