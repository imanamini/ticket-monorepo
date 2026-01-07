import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserProfileResponse } from './digipay/models/user-profile.response';

@Injectable({
  providedIn: 'root',
})
export class BaseHttpClient {
  public api = 'client';

  protected constructor(private http: HttpClient) {}

  static convertDecimalToRgba(integerColor: number, alpha = 1): string {
    // tslint:disable-next-line:no-bitwise
    const r = (integerColor >> 16) & 255;
    // tslint:disable-next-line:no-bitwise
    const g = (integerColor >> 8) & 255;
    // tslint:disable-next-line:no-bitwise
    const b = integerColor & 255;
    return `rgba(${r},${g},${b}, ${alpha})`;
  }

  get(path: string, params: HttpParams | object = {}, options: object = {}): Observable<any> {
    const opt = Object.assign({}, options, {
      params,
    });
    // @ts-ignore
    return this.http.get(this.makePath(path), opt as any).pipe(catchError(this.formatErrors));
  }

  delete(path: string, params: HttpParams = new HttpParams(), options: object = {}): Observable<any> {
    return this.http.delete(this.makePath(path), options);
  }

  post(path: string, body = {}, options = {}): Observable<any> {
    return this.http.post(this.makePath(path), body, options);
  }

  put(path: string, body = {}, options = {}): Observable<any> {
    return this.http.put(this.makePath(path), body, options);
  }

  multipartPost(path: string, formData: FormData): Observable<any> {
    return this.http.post(this.makePath(path), formData);
  }

  getText(path: string): Observable<any> {
    return this.http.get(this.makePath(path), {
      responseType: 'text',
      headers: {
        Accept: 'text/html,application/xhtml+xml;',
      },
    });
  }

  getCertFile(fileId: string): Observable<any> {
    return this.http.get(this.makePath(`certs/${fileId}`), {
      responseType: 'text',
    });
  }

  getApiPath(relativePath) {
    return `${environment.api_core.url}${relativePath}`;
  }

  getUserProfile(): Observable<UserProfileResponse> {
    return this.get('users/profile');
  }

  removeHostFromUrl(url: string): string {
    // api prefix which is /digipay/api in most of the time
    const prefix = environment.api.prefix;
    const pattern = new RegExp('.*(' + prefix + '/)(.*)');
    return url.replace(pattern, '$1$2');
  }

  getPageFile(pageFileId) {
    return this.http.get(this.fileUrl(pageFileId), {
      responseType: 'text',
      headers: {
        Accept: 'text/html,application/xhtml+xml;',
      },
    });
  }

  fileUrl(fileId) {
    return `${environment.api_core.url}files/${fileId}`;
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  private makePath(path: string): string {
    if (path[0] !== '/') {
      path = '/' + path;
    }
    if (this.api === 'client' && path.indexOf(environment.api.prefix) < 0) {
      path = environment.api.prefix + path;
    }
    if (this.api === 'digipay' && path.indexOf(environment.api_core.url) < 0) {
      path = environment.api_core.url + path;
    }

    return path;
  }
}
