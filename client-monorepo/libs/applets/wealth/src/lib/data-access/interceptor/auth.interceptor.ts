import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { RequestHeaderHandlerService } from '../../components/core/services/request-header-handler.service';
import { Router } from '@angular/router';
import { NavigationConfig } from '@client-monorepo/wealth/navigation';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private requestHeaderHandlerService: RequestHeaderHandlerService,
    private router: Router,
    @Inject('APP_CONFIG') private config: NavigationConfig,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.config.appName === 'wealth' || this.router.url.startsWith('/mini-app/wealth')) {
      request = this.requestHeaderHandlerService.updateHeader(request);
      return next.handle(request);
    }
    return next.handle(request);
  }
}
