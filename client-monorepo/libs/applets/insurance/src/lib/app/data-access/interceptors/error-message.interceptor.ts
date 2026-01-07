import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { MessageService } from '@client-monorepo/common/utilities';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ERROR_HANDLE_KEY, ErrorHandleHeaderEnum } from '../enums/error-handle-header.enum';
import { isInsuranceRequest } from './insurance-request.utils';
import { Router } from '@angular/router';

@Injectable()
export class ErrorMessageInterceptor implements HttpInterceptor {
  private readonly ignoredErrors = ['PlateAlreadyExists', 'PriceQuerySessionNotFound'];
  private router = inject(Router);
  private messageService = inject(MessageService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!isInsuranceRequest(request, this.router)) {
      return next.handle(request);
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (this.doesRequestErrorNeedHandling(request, error)) {
          this.messageService.showErrorMessage(error?.error?.error?.title);
        }
        return throwError(() => error);
      }),
    );
  }

  doesRequestErrorNeedHandling(request: HttpRequest<any>, error: HttpErrorResponse): boolean {
    const hasErrorHandleKey: boolean = request.headers.has(ERROR_HANDLE_KEY);
    if (!hasErrorHandleKey) {
      return this.doesErrorHaveTitle(error) && !this.doesErrorContainIgnoredErrorKey(error);
    }
    const errorHandleValue: number = +request.headers.get(ERROR_HANDLE_KEY);
    return errorHandleValue === ErrorHandleHeaderEnum.HANDLE;
  }

  doesErrorHaveTitle(error: HttpErrorResponse): boolean {
    return !!error?.error?.error?.title;
  }

  doesErrorContainIgnoredErrorKey(error: HttpErrorResponse): boolean {
    return this.ignoredErrors.some((ignoredError) => error?.error?.error?.key === ignoredError);
  }
}
