import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpContext, HttpContextToken, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'apps/dpx/src/environments/environment';

export const SKIP_BASIC_TOKEN = new HttpContextToken<boolean>(() => false);
@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  apiUrl = '';

  constructor(private http: HttpClient) {
    this.apiUrl = environment.base_url + '/wealth/';
  }

  protected getDPXApiUrl(): string {
    if (environment.env === 'production') {
      return 'https://api.mydigipay.com/digipay/api/';
    } else {
      return 'https://uat.mydigipay.info/digipay/api/';
    }
  }

  private formatErrors(error: any) {
    return throwError(error?.error || error);
  }

  private checkHeaders(headers?: HttpHeaders): HttpHeaders {
    if (!headers) {
      headers = new HttpHeaders().set('Content-Type', 'application/json');
    }

    const headerKeys = headers.keys();

    if (headerKeys.length > 0 && (headerKeys.indexOf('content-type') || headerKeys.indexOf('Content-Type')) < 0) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  private checkPath(path: string): string {
    return path.startsWith('/') ? path.slice(1) : path;
  }

  private getAbsoluteUrl(url: string): string {
    return this.apiUrl + this.checkPath(url);
  }

  private getAbsoluteDPXUrl(url: string): string {
    return this.getDPXApiUrl() + this.checkPath(url);
  }

  get(path: string, params: HttpParams = new HttpParams(), headers?: HttpHeaders): Observable<any> {
    path = this.getAbsoluteUrl(path);
    headers = this.checkHeaders(headers);

    return this.http
      .get(path, {
        params,
        headers,
      })
      .pipe(catchError(this.formatErrors));
  }

  getDPX(path: string, params: HttpParams = new HttpParams(), headers?: HttpHeaders): Observable<any> {
    path = this.getAbsoluteDPXUrl(path);
    headers = this.checkHeaders(headers);

    return this.http
      .get(path, {
        params,
        headers,
      })
      .pipe(catchError(this.formatErrors));
  }

  getFile(path: string): Observable<any> {
    path = this.getAbsoluteUrl(path);
    return this.http
      .get(path, {
        responseType: 'arraybuffer',
      })
      .pipe(catchError(this.formatErrors));
  }

  getStaticFile<T>(path: string): Observable<T> {
    return this.http.get<T>(path).pipe(catchError(this.formatErrors));
  }

  put(path: string, body: object = {}, context?: HttpContext): Observable<any> {
    path = this.getAbsoluteUrl(path);

    return this.http
      .put(path, JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json',
        },
        context,
      })
      .pipe(catchError(this.formatErrors));
  }

  post(path: string, body: object = {}, headers?: HttpHeaders, context?: HttpContext): Observable<any> {
    headers = this.checkHeaders(headers);
    path = this.getAbsoluteUrl(path);
    return this.http
      .post(path, JSON.stringify(body), {
        headers: headers,
        context,
      })
      .pipe(catchError(this.formatErrors));
  }

  postAuth(path: string, body: object = {}): Observable<any> {
    path = this.getAbsoluteUrl(path);
    return this.http.post(path, JSON.stringify(body)).pipe(catchError(this.formatErrors));
  }

  /**
   * Convert the given absolute URL to a relative URL
   *
   * Sometimes URL is an absolute full url (like http://api.mydigipay.com/digipay/api/what/ever)
   * and we need to convert it to a relative URL, in this case we can use this helper method.
   *
   * @param fullAbsoluteUrl
   */
  static convertToRelativeUrl(fullAbsoluteUrl: string) {
    return fullAbsoluteUrl.substr(fullAbsoluteUrl.lastIndexOf('/api') + 5);
  }
}
