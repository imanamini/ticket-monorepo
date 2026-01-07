import { Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpStatusCodeEnum, RefreshNotifierService } from '@client-monorepo/common/network';
import { StorageService } from '@client-monorepo/common/utilities';
import { AuthResponse } from '../../components/core/models/auth-response.interface';
import { LOGIN_URL } from '../../../../../../shared/common/network/src/lib/data-access/services/api-constants';
import { AuthService } from '@client-monorepo/common/user';
import { WEALTH_TOKEN } from '../../components/utils/variables';

const REFRESH_TOKEN_URL = 'users/token/refresh';
const MAX_RETRY_REFRESHING = 3;

type QueuedRequest = {
  request: HttpRequest<any>;
  next: HttpHandler;
};

@Injectable({
  providedIn: 'root',
})
export class HttpRefreshInterceptor implements HttpInterceptor {
  private retryCounter = 0;
  private authService = inject(AuthService);
  private isInRefreshingTokenState = false;
  private refreshedSubject = new Subject<number>();
  private storageService = inject(StorageService);
  private refreshNotifierService = inject(RefreshNotifierService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (this.isUnauthorizedError(error) && !this.isAuthenticationChallenged(error)) {
          if (request.url.endsWith(REFRESH_TOKEN_URL)) {
            return this.handleRefreshTokenRequestError(request, next);
          } else if (!request.url.endsWith(LOGIN_URL)) {
            return this.handleGeneral401Error(request, next);
          }
        }
        return throwError(() => error);
      }),
    );
  }

  private isAuthenticationChallenged(error: any): boolean {
    return error?.error?.error?.title === 'AuthenticationChallenged';
  }

  private isUnauthorizedError(error: HttpErrorResponse): boolean {
    return error.status === HttpStatusCodeEnum.Unauthorized;
  }

  private handleGeneral401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const mainRequest = { request, next };
    if (!this.isInRefreshingTokenState) {
      return this.handleRefreshTokenRequestError(request, next);
    } else {
      return this.refreshedSubject.asObservable().pipe(switchMap(() => this.handleMainRequest(mainRequest)));
    }
  }

  private handleMainRequest(mainRequest: QueuedRequest): Observable<HttpEvent<any>> {
    const req = this.changeJustBeforeNext(mainRequest.request);
    return mainRequest.next.handle(req);
  }

  private changeJustBeforeNext(request: HttpRequest<any>): HttpRequest<any> {
    const token: string | null = this.storageService.getToken();
    const wealthToken = JSON.parse(localStorage.getItem(WEALTH_TOKEN))?.accessToken;
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}`, 'w-authorization': `Bearer ${wealthToken}` },
    });
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
    this.resetState();
    this.authService.performLocalLogout();
    return throwError(() => new Error('You have to go to login!'));
  }

  private resetState(): void {
    this.retryCounter = 0;
    this.isInRefreshingTokenState = false;
  }

  // #*#*#*#**#*#*##**#*#*#*#**#*#***#**#*#**#*#*#*#**#
  // private holdingRequest(request: HttpRequest<any>, next: HttpHandler): any {
  //   return this.tokenNotifier.pipe(
  //     filter((token: string | null) => token !== null && token !== undefined),
  //     take(1),
  //     switchMap((token: string | null) => {
  //       return this.handleCachedRequest(request, next, token);
  //     }),
  //   );
  // }

  // private handleCachedRequest(request: HttpRequest<any>, next: HttpHandler, response: any): Observable<HttpEvent<any>> {
  //   return !request.url.endsWith(REFRESH_TOKEN_URL)
  //     ? next.handle(this.requestHeaderHandlerService.updateHeader(request))
  //     : throwError(() => response);
  // }

  // private handle401Error(request: HttpRequest<any>, next: HttpHandler, error?: any): Observable<HttpEvent<any>> {
  //   if (this.shouldRefreshToken(request)) {
  //     this.startTokenRefresh();
  //
  //     // if (this.isAuthenticationChallenged(error)) {
  //     //   return this.refreshWealthToken(request, next);
  //     // }
  //
  //     return this.refreshDGPToken(request, next);
  //   }
  //
  //   return this.holdingRequest(request, next);
  // }

  // private resetRetryCounter(): void {
  //   this.retryCounter = 0;
  // }

  // private isUnableToProceed(error: any): boolean {
  //   return error instanceof HttpErrorResponse && error.status === HttpStatusCodeEnum.Unable_Process;
  // }

  // private handleUnProceedRequest(e: any, req: HttpRequest<any>): Observable<HttpEvent<any>> | null {
  //   const errorCode = e.error?.error?.code;
  //   if (exceptionalErrorCodes.includes(errorCode)) {
  //     return null;
  //   }
  //   switch (errorCode) {
  //     case ErrorCodes.SessionIsExpired:
  //       return this.handleSessionExpired();
  //
  //     case ErrorCodes.passwordExpired:
  //       if (!req.url.endsWith('/v1/lead/collect')) {
  //         return this.handlePasswordExpired();
  //       }
  //       break;
  //
  //     case ErrorCodes.invalidRefreshToken:
  //       this.handleInvalidRefreshToken();
  //       break;
  //
  //     default:
  //       if (e.status === 422 && req.headers.get('x-clientpage')) {
  //         this.handleClientPageError(e, req);
  //       }
  //       break;
  //   }
  //   return null;
  // }

  // private generateUnplannedError(e: any, req: HttpRequest<any>) {
  //   if (this.shouldNavigateToGeneralError(req)) {
  //     const errorState: GeneralErrorModel = {
  //       title: 'سرویس‌دهنده در دسترس نیست',
  //       description: 'لطفا دقایقی دیگر دوباره تلاش کنید.',
  //       pageTitle: this.generatePageTitle(req.headers.get('x-clientpage')),
  //       isState: true,
  //       icon: 'disconnected.svg',
  //     };
  //     this.navigationService.navigate([GENERAL_ERROR_ROUTE], {
  //       state: errorState,
  //     });
  //     return;
  //   }
  //   this.snackbarError(e);
  // }

  // private shouldNavigateToGeneralError(req: HttpRequest<any>): boolean {
  //   return !!req.headers.get('x-clientpage') && !req.url.includes(REFRESH_TOKEN_URL);
  // }

  // private snackbarError(error: any) {
  //   if (this.displaySnackbar(error?.error?.error?.code)) {
  //     const msg = error?.error?.error?.title || error?.error?.error?.description || `خطای فنی!`;
  //     const desc = !error?.error?.error?.title && !error?.error?.error?.description ? 'لطفاً دقایقی دیگر تلاش کنید.' : '';
  //     if (!error.url.includes('/api/files/')) {
  //       this.messageService.showErrorMessage(msg, desc);
  //     }
  //   }
  // }

  // private displaySnackbar(code: number): boolean {
  //   const suppressedCodes = new Set<number | undefined>([
  //     ErrorCodes.kYCShahkarCellNumberMissmatchNationalId,
  //     ErrorCodes.CustomerNotRegisteredInFund,
  //     ErrorCodes.customerNotExist,
  //     ErrorCodes.CustomerIsNotSejami,
  //     ErrorCodes.SessionIsExpired,
  //     ErrorCodes.validateNationalIdFailed,
  //     ErrorCodes.InvalidOtp,
  //     undefined,
  //   ]);
  //
  //   return !suppressedCodes.has(code);
  // }

  // private refreshWealthToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return this.maknaAuthenticationService.refresh().pipe(
  //     switchMap((response) => {
  //       this.handleSuccessfulRefresh(response);
  //       return this.handleCachedRequest(request, next, response);
  //     }),
  //     catchError((error) => this.handleRefreshError(error, request, next)),
  //     finalize(() => this.onTokenRefreshComplete()),
  //   );
  // }

  // private handleSuccessfulRefresh(response: any): void {
  //   this.resetRetryCounter();
  //   this.tokenNotifier.next(response?.result?.accessToken || null);
  // }

  // private handleRefreshError(error: any, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return request.url.endsWith(REFRESH_TOKEN_URL) || request.url.endsWith(DGP_REFRESH)
  //     ? next.handle(error)
  //     : this.holdingRequest(request, next);
  // }

  // private refreshDGPToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return this.authService.postRefreshToken().pipe(
  //     switchMap((response) => this.handleDGPTokenRefreshSuccess(response, request, next)),
  //     catchError((err) => this.handleRefreshError(err, request, next)),
  //     finalize(() => this.onTokenRefreshComplete()),
  //   );
  // }

  // private handleDGPTokenRefreshSuccess(response: AuthResponse, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   this.resetRetryCounter();
  //   this.authenticationStorageService.updateAuth(response);
  //   // const wealthTokenExists = !!JSON.parse(localStorage.getItem(WEALTH_TOKEN) || 'false');
  //   // if (wealthTokenExists) {
  //   //   return this.refreshWealthToken(request, next);
  //   // }
  //   return this.handleCachedRequest(request, next, response);
  // }

  // private onTokenRefreshComplete(): void {
  //   this.isRefreshing = false;
  // }

  // private providerNotAvalible(errorCode: number): boolean {
  //   const providerNotAvalibleErrors = [ErrorCodes.timeout, ErrorCodes.BitpendarRequestTimeout];
  //   return providerNotAvalibleErrors.includes(errorCode);
  // }

  // private generatePageTitle(xClient: string | null): string {
  //   if (xClient?.includes('purchase')) return 'سرمایه‌گذاری';
  //   return 'خطا';
  // }

  // private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler, error: any): Observable<HttpEvent<any>> {
  //   if (request.url.endsWith(REFRESH_TOKEN_URL)) {
  //     return this.handleRefreshTokenRequestError(request, next, error);
  //   }
  //
  //   if (request.url.includes('/digipay/api/users/login')) {
  //     return throwError(() => error);
  //   }
  //
  //   return this.handle401Error(request, next, error);
  // }

  // private isForbiddenRefreshError(request: HttpRequest<any>, error: any): boolean {
  //   return request.url.endsWith(REFRESH_TOKEN_URL) && error.status === HttpStatusCodeEnum.Forbidden;
  // }

  // private handleOtherErrors(error: any, request: HttpRequest<any>): void {
  //   if (
  //     error.status !== HttpStatusCodeEnum.ServerError &&
  //     !error.url?.includes('api/files') &&
  //     !error.url?.includes('/v1/collateral/launch')
  //   ) {
  //     this.generateUnplannedError(error, request);
  //   } else {
  //     this.snackbarError(error);
  //   }
  // }

  // private isAuthenticationChallenged(error: any): boolean {
  //   return error?.error?.error?.title === 'AuthenticationChallenged';
  // }

  // private shouldRefreshToken(request: HttpRequest<any>): boolean {
  //   return !this.isRefreshing || (request.url.endsWith(REFRESH_TOKEN_URL) && this.retryCounter < MAX_RETRY_REFRESHING);
  // }

  // private startTokenRefresh(): void {
  //   this.isRefreshing = true;
  //   this.tokenNotifier.next(null);
  // }

  // private handleSessionExpired(): null {
  //   localStorage.removeItem(WEALTH_TOKEN);
  //   this.navigationService.navigate([EXPIRED_SESSION_NOTICE_ROUTE]);
  //   return null;
  // }

  // private handlePasswordExpired(): null {
  //   this.navigationService.navigate([EXPIRED_NOTICE_ROUTE]);
  //   return null;
  // }

  // private handleInvalidRefreshToken(): void {
  //   localStorage.removeItem(WEALTH_TOKEN);
  //   this.maknaAuthenticationService.loginDGP().subscribe({
  //     next: (res) => {
  //       if (res?.success) {
  //         if (res.result.requiresPassword) {
  //           const redirectUrl =
  //             this.navigationService.getCurrentUrl() !== '/' ? this.navigationService.getCurrentUrl() : environment.afterLoginUrl;
  //           localStorage.setItem('redirectUrl', redirectUrl);
  //           const queryParams = this.activatedRoute.snapshot.queryParams;
  //           this.navigationService.navigate([LOGIN_ROUTE], { queryParams });
  //         } else {
  //           window.location.reload();
  //         }
  //       } else {
  //         this.handleRedirectToDPX();
  //       }
  //     },
  //   });
  // }

  // private handleRedirectToDPX() {
  //   sessionStorage.setItem('redirectUrlAfterLogin', window.location.href);
  //   window.open(environment.supperAppLoginUrl, '_self');
  // }

  // private handleClientPageError(e: any, req: HttpRequest<any>): void {
  //   const errorCode = e?.error?.error?.code;
  //   if (errorCode === ErrorCodes.rayanGetCustomerOrdersFailed || errorCode === ErrorCodes.rayanCancelOrderOtpFailed) {
  //     e.error.error['isState'] = true;
  //     e.error.error['pageTitle'] = req.headers.get('x-clientpage');
  //     this.errorService.setGeneralError(e.error.error);
  //     this.navigationService.navigate([GENERAL_ERROR_ROUTE]);
  //   } else if (this.providerNotAvalible(errorCode)) {
  //     this.generateUnplannedError(e, req);
  //   } else {
  //     this.snackbarError(e);
  //   }
  // }

  // private isWealthAppContext(): boolean {
  //   return this.config.appName === 'wealth' || this.router.url.startsWith('/mini-app/wealth');
  // }
}
