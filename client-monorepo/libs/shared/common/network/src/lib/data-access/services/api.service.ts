import { Inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { RequestBuilder } from './request-builder';
import { AbTestService, StorageService } from '@client-monorepo/common/utilities';
import { NgxApiConfigService } from '@digipay/ngx-api-config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpWithoutInterceptor: HttpClient;
  constructor(
    @Inject('APP_ENV') private environment: { [key: string]: string },
    private http: HttpClient,
    private storageService: StorageService,
    private ngxApiConfigService: NgxApiConfigService,
    httpBackend: HttpBackend,
  ) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  public call<T>(request: RequestBuilder): Observable<T> {
    const endpoint = request.endpoint.startsWith('/') ? request.endpoint : `/${request.endpoint}`;

    const baseUrl = this.environment[AbTestService.callApiWithAbsoluteUrl() ? 'base_url_abs' : 'base_url'];

    const finalUrl = `${baseUrl}${endpoint}`;

    if (request.forceSend) {
      return this.forceSend<T>(request, finalUrl);
    }

    return this.http.request<T>(request.method, finalUrl, {
      ...request.getOptions(),
      params: request.getParams(),
      headers: request.getHeader(),
      body: request.body,
    });
  }

  // Sends a fire-and-forget request using fetch with keepalive, returning an Observable<T>

  private forceSend<T>(request: RequestBuilder, finalUrl: string): Observable<T> {
    const token: string | null = this.storageService.getToken();

    const headers = {
      Authorization: token ? `Bearer ${token}` : '',
      Agent: this.ngxApiConfigService.getApiConstants().agent,
      'Digipay-Version': this.ngxApiConfigService.getApiConstants().digipayVersion as string,
      'Client-Version': '1.0.0',
      Accept: 'application/json, application/octet-stream, text/plain, */*, text/html',
      'Content-Type': 'application/json; charset=utf8',
      'ngsw-bypass': 'true',
    };

    // Convert HttpParams to query string and append to URL
    const httpParams: HttpParams | undefined = request.getParams?.();
    if (httpParams) {
      const queryParts: string[] = [];
      httpParams.keys().forEach((key) => {
        httpParams.getAll(key)?.forEach((value) => {
          queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        });
      });
      if (queryParts.length > 0) {
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryParts.join('&');
      }
    }

    const fetchOptions = {
      method: request.method,
      headers,
      body: request.body ? JSON.stringify(request.body) : undefined,
      keepalive: true,
    };

    const fetchPromise: Promise<T> = fetch(finalUrl, fetchOptions)
      .then(() => ({}) as T)
      .catch(() => ({}) as T);

    return from(fetchPromise);
  }

  public callWithoutInterceptor<T>(request: RequestBuilder): Observable<T> {
    let endpoint = request.endpoint;
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }

    const finalUrl = `${this.environment[AbTestService.callApiWithAbsoluteUrl() ? 'base_url_abs' : 'base_url']}${endpoint}`;
    return this.httpWithoutInterceptor.request<T>(request.method, finalUrl, {
      ...request.getOptions(),
      params: request.getParams(),
      headers: request.getHeader(),
      body: request.body,
    });
  }
}
