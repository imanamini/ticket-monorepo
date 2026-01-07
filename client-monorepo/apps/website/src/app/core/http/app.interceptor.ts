import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LayoutService } from '../../website/services/layout.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) public platformId: string,
    private layoutService: LayoutService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = this.checkServerSideRequests(req);

    return next
      .handle(req)
      .pipe(
        map((event: HttpEvent<any>): HttpEvent<any> => {
          this.checkTopBanner(event);
          return event;
        }),
      )
      .pipe(
        catchError((err: any) => {
          // check body of error for redirection protocol
          this.checkRedirection(err);

          return throwError(err);
        }),
      );
  }

  private checkTopBanner(event: any): void {
    if (event instanceof HttpResponse) {
      if ((event && event.body && event.body.hasOwnProperty('TOP_BANNER')) || event.body.hasOwnProperty('TOP_PROMOTION_BANNER')) {
        const banner = event.body.TOP_BANNER || event.body.TOP_PROMOTION_BANNER;
        if (!banner) {
          this.layoutService.hideTopBanner();
        } else {
          this.layoutService.setTopBanner(event.body.TOP_BANNER || event.body.TOP_PROMOTION_BANNER);
        }
      }
    }
  }

  /**
   * Upper-case keys are agreed with back-end APIs
   *
   * @param event
   * @private
   */
  private checkRedirection(event: any): void {
    if (event instanceof HttpErrorResponse) {
      if (event.error && event.error.FORCE_REDIRECT) {
        window.location.href = event.error.DESTINATION;
      }
    }
  }

  /**
   * Checks the platform and if it's SERVER,
   * concatenates API HOST to request URL
   * to make an absolute URL
   *
   * @param req
   * @private
   */
  private checkServerSideRequests(req: HttpRequest<any>): HttpRequest<any> {
    if (req.url.indexOf(environment.api.host) < 0 && req.url.indexOf('http') < 0) {
      req = req.clone({
        url: environment.api.host + req.url,
      });
    }

    return req;
  }
}
