import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreditUrlService } from '../utils/url';
import { Router } from '@angular/router';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../credit-environment.interface';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  apiUrl = '';

  constructor(
    private http: HttpClient,
    public creditUrlService: CreditUrlService,
    private router: Router,
    @Inject(CREDIT_ENVIRONMENT)
    private creditEnvironment: CreditEnvironmentInterface,
  ) {
    this.apiUrl = this.creditUrlService.getApiUrl();
  }

  static convertDecimalToRgba(integerColor: number, alpha = 1): string {
    // tslint:disable-next-line:no-bitwise
    const r = (integerColor >> 16) & 255;
    // tslint:disable-next-line:no-bitwise
    const g = (integerColor >> 8) & 255;
    // tslint:disable-next-line:no-bitwise
    const b = integerColor & 255;
    return `rgba(${r},${g},${b}, ${alpha})`;
  }

  getAbsoluteUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${this.apiUrl}${url}`;
  }

  get(path: string, params: HttpParams = new HttpParams(), headers?: HttpHeaders): Observable<any> {
    path = this.checkPath(path);
    headers = this.checkHeaders(headers!);

    return this.http
      .get(`${this.apiUrl}${path}`, {
        params,
        headers,
      })
      .pipe(catchError(this.formatErrors.bind(this)));
  }

  put(path: string, body: object = {}): Observable<any> {
    path = this.checkPath(path);

    return this.http
      .put(`${this.apiUrl}${path}`, JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(catchError(this.formatErrors.bind(this)));
  }

  post(path: string, body: object = {}, headers?: HttpHeaders): Observable<any> {
    headers = this.checkHeaders(headers!);

    path = this.checkPath(path);

    return this.http.post(`${this.apiUrl}${path}`, JSON.stringify(body), { headers }).pipe(catchError(this.formatErrors.bind(this)));
  }

  delete(path: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}${path}`).pipe(catchError(this.formatErrors.bind(this)));
  }

  getImage(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}files/${id}`, { responseType: 'blob' }).pipe(catchError(this.formatErrors.bind(this)));
  }

  getCreditImage(id: string): Observable<any> {
    // id should contain minio's bucket name too.
    // example: activation/qwe0230-139392kwe.png
    return this.http.get(`${this.apiUrl}contents/${id}`, { responseType: 'blob' }).pipe(catchError(this.formatErrors.bind(this)));
  }

  fileUrl(fileId: any) {
    return `${this.apiUrl}files/${fileId}`;
  }

  getPage(pageFileId: any) {
    return this.http.get(this.fileUrl(pageFileId), {
      responseType: 'text',
      headers: {
        Accept: 'text/html,application/xhtml+xml;',
      },
    });
  }

  getHtml(relativeUrl: any) {
    relativeUrl = this.checkPath(relativeUrl);
    const absoluteUrl = this.getAbsoluteUrl(relativeUrl);
    return this.http.get(absoluteUrl, {
      responseType: 'text',
      headers: {
        Accept: 'text/html,application/xhtml+xml;',
      },
    });
  }

  multiPartUpload(path: string, formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}${path}`, formData, {
        headers: {
          // 'Content-Type': 'multipart/form-data'
          // 'Content-Type': undefined,
          'ngsw-bypass': '1',
        },
      })
      .pipe(catchError(this.formatErrors.bind(this)));
  }

  private formatErrors(error: any) {
    if (error.status === 429) {
      return throwError(() => ({
        result: {
          title: 'FAILED',
          level: '',
          status: 429,
          message: 'تعداد تلاش در بازه زمانی مشخص بیش از حد مجاز است.',
        },
      }));
    }

    if (error instanceof HttpErrorResponse) {
      if (error.status === 422 && error.error.result && error.error.result.status === 5328) {
        if (error.error.fundProviderCode && error.error.creditId) {
          const fundProviderCode = error.error.fundProviderCode;
          const creditId = error.error.creditId;
          this.router.navigateByUrl(
            this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${fundProviderCode}/${creditId}/suspend`),
          );
          // Return an Observable instead of undefined
          return EMPTY; // or you could return throwError(() => error.error);
        }
      }
    }

    // Ensure we always throw a proper error object, not boolean/primitive values
    const errorToThrow = error.error ?? error;

    // If errorToThrow is not an object or is a boolean/primitive, wrap it in an Error
    if (typeof errorToThrow !== 'object' || errorToThrow === null) {
      return throwError(() => new Error(`API Error: ${String(errorToThrow)}`));
    }

    return throwError(() => errorToThrow);
  }

  private checkHeaders(headers: HttpHeaders): HttpHeaders {
    if (!headers) {
      headers = new HttpHeaders();
    }
    if (!headers.has('Content-Type')) {
      headers = headers.append('Content-Type', 'application/json');
    }

    const headerKeys = headers.keys();

    if (headerKeys.length > 0 && !headers.has('Content-Type')) {
      headers = headers.append('Content-Type', 'application/json');
    }

    return headers;
  }

  private checkPath(path: string) {
    if (path[0] === '/') {
      // remove leading slash form the path
      path = path.substring(1);
    }

    return path;
  }
}
