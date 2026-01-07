import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GeneralErrorService } from '../services/general-error.service';
import { GeneralErrorTypes } from '../models/general-error-types';

@Injectable()
export class HttpGeneralErrorInterceptor implements HttpInterceptor {
  router = inject(Router);
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
    if (!this.router.url.startsWith('/mini-app/wealth')) {
      return next.handle(req).pipe(
        catchError((error) => {
          if (this.getKnownError(error)) {
            this.generalErrorService.error.set(this.getKnownError(error));
          }
          return throwError(error);
        }),
      );
    }
    return next.handle(req);
  }

  private getKnownError(error: any): GeneralErrorTypes | null {
    if (this.ignoreErrorApiList.some((str) => error.url.includes(str))) {
      return null;
    }
    if (error instanceof HttpErrorResponse && !error?.error?.result?.status) {
      if (error.status === 503 || error.status === 504) {
        return GeneralErrorTypes.UNAVAILABLE_SYSTEM_ERROR;
      }

      if (error.status >= 500 && error.status <= 599) {
        return GeneralErrorTypes.SYSTEM_ERROR;
      }
      if (error.status === 403) {
        return GeneralErrorTypes.ACCESS_ERROR;
      }
      if (error.status === 429) {
        return GeneralErrorTypes.ACCESS_ERROR;
      }
    }
    return null;
  }
}
