import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UtilityApiService } from './utility-api.service';
import { NoInterceptorOptionsModel } from '../models/no-interceptor-options.model';
import { StorageKeysEnum } from '../enums/storage-keys.enum';
import { AuthModel } from '../../features/auth/models/auth.model';
import { NgxApiConfigService } from '@digipay/ngx-api-config';

@Injectable({
  providedIn: 'root'
})
export class NoInterceptorService {
  private apiConfigService = inject(NgxApiConfigService);
  private utilityApiService = inject(UtilityApiService);
  private httpClient: HttpClient;

  constructor(httpBackend: HttpBackend) {
    // Create an HttpClient instance that will not use the interceptors
    this.httpClient = new HttpClient(httpBackend);
  }

  private getAccessToken(): string | null {
    const raw = localStorage.getItem(StorageKeysEnum.KEY_NAME_AUTH_STORAGE);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as AuthModel;
      return parsed?.auth?.access ?? null;
    } catch {
      return null;
    }
  }

  post(url: string, options: NoInterceptorOptionsModel): Observable<any> {
    url = this.utilityApiService.checkPath(url);
    return this.httpClient.post(url, options.body, this.createRequestOptions(url, options));
  }

  get(url: string, options: NoInterceptorOptionsModel): Observable<any> {
    url = this.utilityApiService.checkPath(url);
    return this.httpClient.get(url, this.createRequestOptions(url, options));
  }

  put(url: string, options?: NoInterceptorOptionsModel): Observable<any> {
    url = this.utilityApiService.checkPath(url);
    return this.httpClient.put(url, options.body, this.createRequestOptions(url, options));
  }

  createRequestOptions(url: string, options?: NoInterceptorOptionsModel): NoInterceptorOptionsModel {
    options = Object.assign({headers: null, options: {}, tokenType: 'none'}, options);
    options.headers = this.utilityApiService.checkHeaders(options.headers, url);
    switch (options.tokenType) {
      case 'bearer':
        const token = this.getAccessToken();
        if (token) {
          options.headers = options.headers.set('Authorization', `Bearer ${token}`);
        }
        break;
      case 'basic':
        options.headers = options.headers.set('Authorization', this.apiConfigService.getBasicAuthHeader());
        break;
      case 'none':
      default:
        break;
    }
    return Object.assign({}, options);
  }
}
