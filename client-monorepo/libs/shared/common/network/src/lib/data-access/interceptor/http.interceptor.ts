import { Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpStatusCodeEnum } from '../models/http-status-code.enum';
import { AuthResponse, AuthService } from '@client-monorepo/common/user';
import { LOGIN_URL, MAX_RETRY_REFRESHING, REFRESH_TOKEN_URL } from '../services/api-constants';
import { StorageService } from '@client-monorepo/common/utilities';
import { RefreshNotifierService } from '@client-monorepo/common/network';
import { Router } from '@angular/router';

type QueuedRequest = {
  request: HttpRequest<any>;
  next: HttpHandler;
};

@Injectable()
export class HttpRefreshInterceptor implements HttpInterceptor {
  isInRefreshingTokenState = false;
  refreshedSubject = new Subject<number>();
  retryCounter = 0;
  storageService = inject(StorageService);
  authService = inject(AuthService);
  refreshNotifierService = inject(RefreshNotifierService);
  router = inject(Router);
  private readonly ignoreErrorApiList = ['/events/send-event'];
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.shouldIgnore401Error(request)) {
      return next.handle(request).pipe(
        catchError((error) => {
          if (!this.isUnauthorizedError(error)) {
            return throwError(() => error);
          }
          if (request.url.endsWith(REFRESH_TOKEN_URL)) {
            return this.handleRefreshTokenRequestError(request, next);
          } else if (!request.url.endsWith(LOGIN_URL)) {
            return this.handleGeneral401Error(request, next);
          }
          return throwError(() => error);
        }),
      );
    }
    return next.handle(request);
  }

  private isUnauthorizedError(error: any): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCodeEnum.Unauthorized;
  }

  private shouldIgnore401Error(request: HttpRequest<any>): boolean {
    const ignoredPaths = ['/forgot-password'];
    return (
      ignoredPaths.some((path) => this.router.url.startsWith(path)) || this.ignoreErrorApiList.some((str) => request.url.includes(str))
    );
  }

  private handleRefreshTokenRequestError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.retryCounter++;
    this.isInRefreshingTokenState = true;
    if (this.retryCounter < MAX_RETRY_REFRESHING) {
      return this.authService.refreshToken().pipe(
        switchMap((response: AuthResponse) => {
          this.storageService.updateAuth(response);
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
    // console.error(`🔴 Token refresh failed after ${MAX_RETRY_REFRESHING} retries. Logging out user.`);
    this.refreshedSubject.error(new Error('Token refresh failed after max retries'));
    this.resetState();
    this.authService.performLocalLogout();
    return throwError(() => new Error('You have to go to login!'));
  }

  private handleGeneral401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const mainRequest = { request, next };
    if (!this.isInRefreshingTokenState) {
      return this.handleRefreshTokenRequestError(request, next);
    } else {
      return this.refreshedSubject.asObservable().pipe(switchMap(() => this.handleMainRequest(mainRequest)));
    }
  }

  private resetState(): void {
    this.retryCounter = 0;
    this.isInRefreshingTokenState = false;
    // Recreate subject in case it was errored/completed
    this.refreshedSubject = new Subject<number>();
  }

  changeJustBeforeNext(request: HttpRequest<any>): HttpRequest<any> {
    const token: string | null = this.storageService.getToken();
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  private handleMainRequest(mainRequest: QueuedRequest): Observable<HttpEvent<any>> {
    const req = this.changeJustBeforeNext(mainRequest.request);
    return mainRequest.next.handle(req);
  }
}
