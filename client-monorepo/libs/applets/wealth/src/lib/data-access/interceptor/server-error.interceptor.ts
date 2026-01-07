import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ErrorCodes } from '../enums/error-codes';
import { inject, Injectable } from '@angular/core';
import { WEALTH_TOKEN } from '../../components/utils/variables';
import { HttpStatusCodeEnum } from '@client-monorepo/common/network';
import { EXPIRED_NOTICE_ROUTE, EXPIRED_SESSION_NOTICE_ROUTE, GENERAL_ERROR_ROUTE } from '../constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { exceptionalErrorCodes } from '../constants/exceptional-error-codes';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ErrorService } from '../../components/core/services/error.service';
import { GeneralErrorModel } from '../models/general-error.model';
import { REFRESH_TOKEN_URL } from '../../../../../../shared/common/network/src/lib/data-access/services/api-constants';
import { MessageService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class ServerErrorInterceptor implements HttpInterceptor {
  private navigationService = inject(WealthNavigationService);
  private errorService = inject(ErrorService);
  private messageService = inject(MessageService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (this.isUnableToProceed(error)) {
          return this.handleUnProceedRequest(error, request);
        }
        if (this.isServerError(error)) {
          return this.snackbarError(error);
        }

        return throwError(() => error);
      }),
    );
  }

  private isUnableToProceed(error: HttpErrorResponse): boolean {
    return error.status === HttpStatusCodeEnum.Unable_Process;
  }

  private isServerError(error: HttpErrorResponse): boolean {
    return error.status === HttpStatusCodeEnum.ServerError;
  }

  private handleUnProceedRequest(error: HttpErrorResponse, req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const errorCode = error.error?.error?.code;
    if (exceptionalErrorCodes.includes(errorCode)) {
      return throwError(() => error);
    }
    switch (errorCode) {
      case ErrorCodes.SessionIsExpired:
        return this.handleSessionExpired(error);

      case ErrorCodes.passwordExpired:
        if (!req.url.endsWith('/v1/lead/collect')) {
          return this.handlePasswordExpired(error);
        }
        break;

      default:
        if (error.status === 422 && req.headers.get('x-clientpage')) {
          this.handleClientPageError(error, req);
        }
        break;
    }
    return throwError(() => error);
  }

  private handleSessionExpired(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    localStorage.removeItem(WEALTH_TOKEN);
    this.navigationService.navigate([EXPIRED_SESSION_NOTICE_ROUTE]);
    return throwError(() => error);
  }

  private handlePasswordExpired(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    this.navigationService.navigate([EXPIRED_NOTICE_ROUTE]);
    return throwError(() => error);
  }

  private handleClientPageError(e: HttpErrorResponse, req: HttpRequest<any>): void {
    const errorCode = e?.error?.error?.code;
    if (errorCode === ErrorCodes.rayanGetCustomerOrdersFailed || errorCode === ErrorCodes.rayanCancelOrderOtpFailed) {
      e.error.error['isState'] = true;
      e.error.error['pageTitle'] = req.headers.get('x-clientpage');
      this.errorService.setGeneralError(e.error.error);
      this.navigationService.navigate([GENERAL_ERROR_ROUTE]);
    } else if (this.providerNotAvalible(errorCode)) {
      this.generateUnplannedError(e, req);
    } else {
      this.snackbarError(e);
    }
  }

  private providerNotAvalible(errorCode: number): boolean {
    const providerNotAvalibleErrors = [ErrorCodes.timeout, ErrorCodes.BitpendarRequestTimeout];
    return providerNotAvalibleErrors.includes(errorCode);
  }

  private generateUnplannedError(e: any, req: HttpRequest<any>) {
    if (this.shouldNavigateToGeneralError(req)) {
      const errorState: GeneralErrorModel = {
        title: 'سرویس‌دهنده در دسترس نیست',
        description: 'لطفا دقایقی دیگر دوباره تلاش کنید.',
        pageTitle: this.generatePageTitle(req.headers.get('x-clientpage')),
        isState: true,
        icon: 'disconnected.svg',
      };
      this.navigationService.navigate([GENERAL_ERROR_ROUTE], {
        state: errorState,
      });
      return;
    }
    this.snackbarError(e);
  }

  private snackbarError(error: any) {
    if (error.url.includes('/get-chart')) {
      return throwError(() => error);
    }

    if (this.displaySnackbar(error?.error?.error?.code)) {
      let msg = error?.error?.error?.title || error?.error?.error?.description || `خطای فنی!`;
      if (error?.error?.error?.code === 1012) {
        msg = error?.error?.error?.fields?.message || `سرویس‌دهنده‌ی صندوق در دسترس نمی‌باشد.`;
      }
      const desc = error?.error?.error?.description ?? 'لطفاً دقایقی دیگر تلاش کنید.';
      if (!error.url.includes('/api/files/')) {
        this.messageService.showErrorMessage(msg, desc);
      }
    }

    return throwError(() => error);
  }

  private shouldNavigateToGeneralError(req: HttpRequest<any>): boolean {
    return !!req.headers.get('x-clientpage') && !req.url.includes(REFRESH_TOKEN_URL);
  }

  private generatePageTitle(xClient: string | null): string {
    if (xClient?.includes('purchase')) return 'سرمایه‌گذاری';
    return 'خطا';
  }

  private displaySnackbar(code: number): boolean {
    const suppressedCodes = new Set<number | undefined>([
      ErrorCodes.kYCShahkarCellNumberMissmatchNationalId,
      ErrorCodes.CustomerNotRegisteredInFund,
      ErrorCodes.customerNotExist,
      ErrorCodes.CustomerIsNotSejami,
      ErrorCodes.SessionIsExpired,
      ErrorCodes.validateNationalIdFailed,
      ErrorCodes.InvalidOtp,
      ErrorCodes.invalidRefreshToken,
      undefined,
    ]);

    return !suppressedCodes.has(code);
  }
}
