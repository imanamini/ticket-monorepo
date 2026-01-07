import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { StorageService } from '../core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CreditHttpService {
  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {
  }

  get(
    path: string,
    params: HttpParams = new HttpParams(),
    headers?: HttpHeaders,
    type: any = 'json',
    absoluteUrl: boolean = false
  ): Observable<any> {
    return this.http.get(absoluteUrl ? path : `${environment.api_url}${path}`, {
      params, headers,
      responseType: type
    })
      .pipe(catchError(this.throwError));
  }

  post(path: string, body: object = {}, headers?: HttpHeaders, type: any = 'json'): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      body,
      {
        headers,
        responseType: type
      }
    ).pipe(catchError(this.throwError));
  }

  getImage(id: string): Observable<any> {
    const headers = new HttpHeaders().set('ticket', this.storage.get('ticket'));
    return this.http.get(`${environment.api_url}files/${id}`, {responseType: 'blob', headers})
      .pipe(catchError(this.throwError));
  }

  getCertFile(fileId: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${environment.api_url}certs/${fileId}`,
      {
        responseType: 'text',
        headers
      }).pipe(catchError(this.throwError));
  }

  private throwError(response: any) {
    const error = Object.assign({}, response.error, {httpStatus: response.status});
    return throwError(error);
  }
}
