import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@client-monorepo/common/user';
import { HttpStatusCodeEnum, RefreshNotifierService } from '@client-monorepo/common/network';
import { Router } from '@angular/router';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PinLayoutService } from '@client-monorepo/common/pin';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { PinStatus } from '@digipay/ngx-pin';

declare const window: any;

@Injectable()
export class PinInterceptor implements HttpInterceptor {
  authService = inject(AuthService);
  bottomSheetService = inject(NgxBottomSheetService);
  refreshNotifierService = inject(RefreshNotifierService);
  router = inject(Router);
  pinLayoutService = inject(PinLayoutService);
  hybridService = inject(NgxHybridServiceService);
  private readonly ignoreErrorApiList = ['/events/send-event', 'app/dpx/vpn/check'];
  constructor() {
    window.isGettingPassword = window.isGettingPassword || false;
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (this.shouldIgnore403(request, error)) {
          return next.handle(request);
        }

        if (this.needGetPassword(error)) {
          window.isGettingPassword = true;
          return this.handle403(request, next);
        }
        if (this.needLogout(error)) {
          this.authService.performLocalLogout();
          return throwError(() => error);
        }
        return throwError(() => error);
      }),
    );
  }

  private shouldIgnore403(request: HttpRequest<any>, error?: HttpErrorResponse): boolean {
    const isUrlWhiteList = this.ignoreErrorApiList.some((str) => request.url.includes(str));
    const hasNoStatus = !error?.error?.result?.status;
    return isUrlWhiteList || hasNoStatus;
  }

  private isForbiddenError(error: any): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCodeEnum.Forbidden;
  }

  private needGetPassword(error: HttpErrorResponse): boolean {
    const whiteList = ['auth', 'forgot-password'];
    const isInWhiteList = whiteList.some((str) => this.router.url.includes(str));
    return this.isForbiddenError(error) && [2007].indexOf(error?.error?.result?.status) >= 0 && !isInWhiteList;
  }

  private needLogout(error: HttpErrorResponse): boolean {
    return this.isForbiddenError(error) && [2002, 2007, 2010].indexOf(error?.error?.result?.status) === -1;
  }

  private handleSuccessStatusOnPin() {
    this.refreshNotifierService.change(true);
    setTimeout(() => {
      this.refreshNotifierService.change(false);
    }, 1000 * 20);
  }

  private handleBlockedStatusOnPin() {
    if (this.hybridService.isHybrid()) {
      this.hybridService.closeApp();
    } else {
      window.location.reload();
    }
    return throwError(() => {
      this.authService.performLocalLogout();
    });
  }

  private handleFailureStatusOnPin() {
    return throwError(() => {
      this.authService.performLocalLogout();
    });
  }

  private handle403(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.pinLayoutService.show({ isOverlay: true, type: true, isBackActionHidden: true });
    const pinOverlay = this.pinLayoutService.onClose.subscribe(() => {
      pinOverlay.unsubscribe();
      const outputData = this.pinLayoutService.outputData();
      if (outputData === PinStatus.SUCCESS) {
        this.handleSuccessStatusOnPin();
        window.isGettingPassword = false;
        return next.handle(request);
      }
      if (outputData === PinStatus.BLOCKED) {
        window.isGettingPassword = false;
        return this.handleBlockedStatusOnPin();
      }
      window.isGettingPassword = false;
      return this.handleFailureStatusOnPin();
    });
    return next.handle(request);
  }
}
