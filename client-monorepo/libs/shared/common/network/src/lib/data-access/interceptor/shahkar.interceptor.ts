import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpStatusCodeEnum } from '@client-monorepo/common/network';
import { ShahkarService } from '@client-monorepo/common/shahkar';
import { Router } from '@angular/router';

@Injectable()
export class ShahkarInterceptor implements HttpInterceptor {
  private shahkarService = inject(ShahkarService);
  private router = inject(Router);
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.router.url.startsWith('/mini-app/wealth')) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse): Observable<HttpEvent<any>> => {
          if (this.needRegisterShahkar(error)) {
            return this.registerShahkar(request, next, error);
          }
          return throwError((): HttpErrorResponse => error);
        }),
      );
    }
    return next.handle(request);
  }

  private needRegisterShahkar(error: HttpErrorResponse): boolean {
    return (
      (error?.status === HttpStatusCodeEnum.Forbidden || error?.status === HttpStatusCodeEnum.Unable_Process) &&
      [2010].indexOf(error?.error?.result?.status) >= 0
    );
  }

  private registerShahkar(request: HttpRequest<any>, next: HttpHandler, error: HttpErrorResponse): Observable<HttpEvent<any>> {
    return from(this.shahkarService.handleShahkarOverlay()).pipe(
      switchMap((result: boolean): Observable<HttpEvent<any>> => {
        if (!result) {
          return throwError((): HttpErrorResponse => error);
        }
        return next.handle(request);
      }),
    );
  }
}
