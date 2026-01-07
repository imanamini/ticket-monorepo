import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(
    private storage: StorageService,
    private router: Router
  ) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any>
    | HttpUserEvent<any> | any> {

    const ticket = this.storage.getTicket();

    if (!ticket) {
      this.flushSession();
      return of(null);
    }

    return next.handle(AppHttpInterceptor.addRequiredHeaders(req, ticket)).pipe(
      catchError(e => {
        switch (e.status) {
          case 401:
            this.flushSession();
            return e;
        }

        return throwError(e);
      }),
    );
  }

  private flushSession(): void {
    this.router.navigate(['no-ticket']).then(() => {
      this.storage.clear();
    });
  }

  private static addRequiredHeaders(req: HttpRequest<any>, ticket: string): HttpRequest<any> {
    let headers = req.headers;
    // Add common API headers
    headers = headers
      .append('Agent', environment.api.agent)
      .append('Digipay-Version', environment.api.version)
      .append('Client-Version', environment.version);

    if (req.headers.keys().indexOf('ticket') < 0) {
      headers = headers.set('ticket', ticket);
    }

    return req.clone({
      headers,
    });
  }
}
