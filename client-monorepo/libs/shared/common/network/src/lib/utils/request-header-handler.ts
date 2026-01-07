import { HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '@client-monorepo/common/utilities';
import { NgxApiConfigService } from '@digipay/ngx-api-config';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';

export class RequestHeaderHandler {
  storageService = inject(StorageService);
  ngxHybridService = inject(NgxHybridService);
  ngxApiConfigService = inject(NgxApiConfigService);

  private readonly ignoreDigipayVersion = ['versions/latest'];

  public updateHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token: string | null = this.storageService.getToken();
    const needsAuth = this.urlDoesNotNeedAuthorize(request.url);

    let headersConfig: Record<string, string | string[]> = {
      Agent: this.ngxApiConfigService.getApiConstants().agent,
      'Client-Version': '1.0.0',
      Accept: 'application/json, application/octet-stream, text/plain, */*, text/html',
      ...(token &&
        !needsAuth && {
          Authorization: `Bearer ${token}`,
        }),
      ...(needsAuth && {
        Authorization: this.ngxApiConfigService.getBasicAuthHeader(),
      }),
    };

    headersConfig = this.needUpdateDigipayVersion(request, headersConfig);

    // Add Cache-Control conditionally
    if (this.shouldAddNoCacheHeader(request.url)) {
      headersConfig = {
        ...headersConfig,
        'Cache-Control': 'no-cache, no-store, max-age=0',
      };
    }

    return request.clone({
      setHeaders: headersConfig,
    });
  }

  private urlDoesNotNeedAuthorize(url: string): boolean {
    url = url.split('?')[0];
    const basicUrlsTails = [
      'refresh',
      'send-sms',
      'activate',
      'password/reset/otp',
      'password/reset',
      'login',
      'app/dpx/vpn/check',
      'app/store/web/stores/search',
    ];
    const basicUrlsMiddles = ['mirror'];
    const exceptions = ['deactivate', 'digicard'];

    if (exceptions.some((str) => url.includes(str))) {
      return false;
    }

    return basicUrlsTails.some((str) => url.endsWith(str)) || basicUrlsMiddles.some((str) => url.includes(str));
  }

  private shouldIgnoreDigipayVersion(request: HttpRequest<any>): boolean {
    return this.ignoreDigipayVersion.some((path) => request.url.includes(path));
  }

  private needUpdateDigipayVersion(
    request: HttpRequest<any>,
    headerConfig: Record<string, string | string[]>,
  ): Record<string, string | string[]> {
    if (this.shouldIgnoreDigipayVersion(request)) {
      return headerConfig;
    }
    if (!request.headers.has('Digipay-Version')) {
      headerConfig = {
        ...headerConfig,
        'Digipay-Version': this.ngxApiConfigService.getApiConstants().digipayVersion as string,
      };
    }
    return headerConfig;
  }

  private shouldAddNoCacheHeader(url: string): boolean {
    const cleanUrl = url.split('?')[0];

    const isDigipayApi = cleanUrl.includes('/digipay/api/');
    const isFilesEndpoint = cleanUrl.includes('/digipay/api/files/');

    return isDigipayApi && !isFilesEndpoint;
  }
}
