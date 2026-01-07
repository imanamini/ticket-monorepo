import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../data-access/environments/environment';
import { exceptionalErrorCodes } from '../../../data-access/constants/exceptional-error-codes';
import { MessageService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private ms: MessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.status === 401) {
              sessionStorage.setItem('redirectUrlAfterLogin', window.location.href);
              window.location.replace(environment.supperAppLoginUrl);
            }
          }
        },
        (e) => {
          if (e.status === 401) {
            sessionStorage.setItem('redirectUrlAfterLogin', window.location.href);
            window.location.replace(environment.supperAppLoginUrl);
          } else {
            const index = exceptionalErrorCodes.findIndex((errorCode) => errorCode === e.error?.error?.code);
            if (index >= 0) return;
            this.ms.showErrorMessage(e.error?.result?.message || e.error?.error?.title);
          }
        },
      ),
    );
  }
}
