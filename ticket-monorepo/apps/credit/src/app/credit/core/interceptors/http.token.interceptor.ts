import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NgxApiConfigService } from '@digipay/ngx-api-config';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  private apiConfigService = inject(NgxApiConfigService);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(this.addTokenToRequest(req));
  }

  addTokenToRequest(request: HttpRequest<any>) {
    const headers: Record<string, string | string[]> = {
      'Digipay-Version': this.apiConfigService.getApiConstants().digipayVersion,
    };

    if (!request.headers.has('Authorization') && !request.headers.has('ticket')) {
      headers.Authorization = this.apiConfigService.getBasicAuthHeader();
    }

    return request.clone({setHeaders: headers});
  }
}
