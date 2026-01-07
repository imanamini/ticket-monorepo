import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UtilityApiService } from './utility-api.service';
import { Params } from '@angular/router';
import { inject } from '@angular/core';

export abstract class ApiService {
  protected utilityApiService = inject(UtilityApiService);

  protected constructor(public http: HttpClient) {}

  /**
   * HTTP GET
   */
  protected get(url: string, params: HttpParams = new HttpParams(), headers?: HttpHeaders, options: object = {}): Observable<any> {
    url = this.utilityApiService.checkPath(url);
    headers = this.utilityApiService.checkHeaders(headers, url);
    const reqOptions = Object.assign({}, { headers, params }, options);
    return this.http.get(url, reqOptions);
  }

  /**
   * HTTP POST
   */
  protected post(url: string, body: object = {}, headers?: HttpHeaders, options: object = {}): Observable<any> {
    url = this.utilityApiService.checkPath(url);
    headers = this.utilityApiService.checkHeaders(headers, url);
    const reqOptions = Object.assign({}, { headers }, options);
    return this.http.post(url, body, reqOptions);
  }

  /**
   * HTTP DELETE
   */
  delete(url: string, id, headers?: HttpHeaders, params?: Params): Observable<any> {
    url = this.utilityApiService.checkPath(url);
    headers = this.utilityApiService.checkHeaders(headers, url);
    const paramsString = params ? new HttpParams({ fromObject: params }).toString() : '';
    return this.http.delete(`${url}/${id}?${paramsString}`, { headers });
  }

  /**
   * HTTP PUT
   */

  put(url: string, body: object = {}, headers?: HttpHeaders): Observable<any> {
    url = this.utilityApiService.checkPath(url);
    headers = this.utilityApiService.checkHeaders(headers, url);
    return this.http.put(`${url}`, body, { headers });
  }
}
