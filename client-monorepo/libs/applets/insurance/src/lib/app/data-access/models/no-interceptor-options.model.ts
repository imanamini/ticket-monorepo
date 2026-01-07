import { HttpHeaders } from '@angular/common/http';

export interface NoInterceptorOptionsModel {
  body?: object;
  headers?: HttpHeaders;
  options?: object;
  tokenType?: 'bearer' | 'basic' | 'none';
}
