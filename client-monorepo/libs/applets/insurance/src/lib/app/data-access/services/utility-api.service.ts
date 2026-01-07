import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from '@client-monorepo/app-core';

@Injectable({
  providedIn: 'root',
})
export class UtilityApiService {
  constructor() {}

  public get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  public checkPath(path: string): string {
    if (path[0] === '/' && path.indexOf('digipay/api') < 0) {
      // remove leading slash form the path
      path = path.substr(1);
    }

    if (this.environment.name !== 'development') {
      if (path.includes('application-forms') && !path.includes('vehicle-thirdparty')) {
        path = '/digipay/api/insurance/v1/' + path;
      }
      if (path.indexOf('digipay/api') < 0) {
        path = '/digipay/api/' + path;
      }
    }
    return path;
  }

  public checkHeaders(headers: HttpHeaders, url: string): HttpHeaders {
    if (!headers) {
      headers = new HttpHeaders().set('Content-Type', 'application/json');
    }
    const headerKeys = headers.keys();
    if (headerKeys.length > 0 && (headerKeys.indexOf('content-type') || headerKeys.indexOf('Content-Type')) < 0) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }
}
