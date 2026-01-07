import { inject, Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap } from 'rxjs/operators';
import { AUTH_TOKEN_KEY, WEALTH_TOKEN } from '../../components/utils/variables';
import { HttpStatusCodeEnum, RefreshNotifierService } from '@client-monorepo/common/network';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { LOGIN_URL } from '../../../../../../shared/common/network/src/lib/data-access/services/api-constants';
import { MaknaAuthenticationService } from '../../features/makna-authentication/services/makna-authentication.service';
import { StorageService } from '@client-monorepo/common/utilities';
import { IDGPTokenModel } from '../models/base/dgp-token.model';
import { environment } from '../environments/environment';
import { ErrorCodes } from '../enums/error-codes';

const REFRESH_TOKEN_URL = 'identity/refresh';
const MAX_RETRY_REFRESHING = 3;
type QueuedRequest = {
  request: HttpRequest<any>;
  next: HttpHandler;
};

@Injectable({
  providedIn: 'root',
})
export class HttpWealthRefreshTokenInterceptor implements HttpInterceptor {
  private retryCounter = 0;
  private isInRefreshingTokenState = false;
  private storageService = inject(StorageService);
  private refreshedSubject = new Subject<number>();
  private refreshNotifierService = inject(RefreshNotifierService);
  private maknaAuthenticationService = inject(MaknaAuthenticationService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (this.isUnauthorizedError(err) && this.isAuthenticationChallenged(err)) {
          if (request.url.endsWith(REFRESH_TOKEN_URL)) {
            return this.refreshWealthToken(request, next);
          } else if (!request.url.endsWith(LOGIN_URL) && !request.url.endsWith(REFRESH_TOKEN_URL)) {
            return this.handleGeneral401Error(request, next);
          }
        } else if (err?.error?.error?.code === ErrorCodes.invalidRefreshToken) {
          localStorage.removeItem(WEALTH_TOKEN);
          return this.loginWealth(request, next);
        }

        return throwError(() => err);
      }),
    );
  }

  private loginWealth(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.isInRefreshingTokenState = true;
    const dgpToken = this.readDgpToken();
    if (!dgpToken?.auth?.access) {
      this.isInRefreshingTokenState = false;
      return this.redirectToLogin(new Error('Missing or invalid access token.'));
    }
    this.retryCounter++;
    return this.maknaAuthenticationService.loginDGP().pipe(
      switchMap((res) => {
        if (!res.success) {
          return this.redirectToLogin(new Error('Login was not successful.'));
        }
        this.refreshedSubject.next(this.retryCounter);
        this.resetState();
        const req = this.changeJustBeforeNext(request);
        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
      finalize(() => {
        this.isInRefreshingTokenState = false;
      }),
    );
  }

  private redirectToLogin(err?: unknown): Observable<never> {
    sessionStorage.setItem('redirectUrlAfterLogin', window.location.href);
    window.open(environment.supperAppLoginUrl, '_self');
    const reason = err instanceof Error ? err : new Error('Redirecting to login.');
    return throwError(() => reason);
  }

  private readDgpToken(): IDGPTokenModel | null {
    const raw = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as IDGPTokenModel;
    } catch {
      return null;
    }
  }

  private isUnauthorizedError(error: HttpErrorResponse): boolean {
    return error.status === HttpStatusCodeEnum.Unauthorized;
  }

  private isAuthenticationChallenged(error: any): boolean {
    return error?.error?.error?.title === 'AuthenticationChallenged';
  }

  private refreshWealthToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.retryCounter++;
    this.isInRefreshingTokenState = true;
    if (this.retryCounter < MAX_RETRY_REFRESHING) {
      return this.maknaAuthenticationService.refresh().pipe(
        switchMap(() => {
          this.refreshedSubject.next(this.retryCounter);
          this.resetState();
          const req = this.changeJustBeforeNext(request);
          return next.handle(req);
        }),
        catchError(() => {
          return this.refreshNotifierService.refreshNotifier.pipe(
            filter((x) => x),
            switchMap(() => {
              this.refreshedSubject.next(this.retryCounter);
              this.resetState();
              const req = this.changeJustBeforeNext(request);
              return next.handle(req);
            }),
          );
        }),
      );
    }
    this.resetState();
    return throwError(() => new Error('You have to go to login!'));
  }

  private resetState(): void {
    this.retryCounter = 0;
    this.isInRefreshingTokenState = false;
  }

  private changeJustBeforeNext(request: HttpRequest<any>): HttpRequest<any> {
    const token: string | null = this.storageService.getToken();
    const wealthToken = JSON.parse(localStorage.getItem(WEALTH_TOKEN))?.accessToken;
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}`, 'w-authorization': `Bearer ${wealthToken}` },
    });
  }

  private handleGeneral401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const mainRequest = { request, next };
    if (!this.isInRefreshingTokenState) {
      return this.refreshWealthToken(request, next);
    } else {
      return this.refreshedSubject.asObservable().pipe(switchMap(() => this.handleMainRequest(mainRequest)));
    }
  }

  private handleMainRequest(mainRequest: QueuedRequest): Observable<HttpEvent<any>> {
    const req = this.changeJustBeforeNext(mainRequest.request);
    return mainRequest.next.handle(req);
  }
}
