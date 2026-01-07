import { Inject, inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { GeneralErrorService } from '@client-monorepo/common/network';
import { GeneralErrorTypes } from '../models/general-error-types';

export const DEFAULT_TIMEOUT = 70000;

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {}
  generalErrorService = inject(GeneralErrorService);
  private readonly ignoreErrorApiList = [
    'digipay/api/files/',
    '/events/send-event',
    'app/dpx/mirror',
    'app/dpx/vpn/check',
    'dpx/payment/upcoming/installment',
    'dpx/services/assets',
    'wealth/v1/customer/portfolio-per-fund',
    'app/app-messaging',
  ];
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutValue = req.headers.get('timeout') || DEFAULT_TIMEOUT;
    const timeoutValueNumeric = Number(timeoutValue);
    return next.handle(req).pipe(
      timeout(timeoutValueNumeric),
      catchError((err) => {
        if (this.shouldHandleError(err) && this.isTimeOUtError(err)) {
          this.generalErrorService.detail.set(JSON.stringify(err));
          this.generalErrorService.error.set(GeneralErrorTypes.TIMEOUT_ERROR);
        }
        return throwError(() => err);
      }),
    );
  }

  isTimeOUtError(err: any): boolean {
    if (err && err.url && this.ignoreErrorApiList.some((str) => err.url.includes(str))) {
      return false;
    }
    return err.status === 0 || err.name === 'TimeoutError';
  }

  shouldHandleError(err: any): boolean {
    return err?.url?.includes(this.environment['base_url']) ?? false;
  }
}
