import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseHttpClient {

  constructor(public http: HttpClient) {
  }

  private static makePath(path: string): string {
    if (path[0] !== '/') {
      path = '/' + path;
    }
    if (path.indexOf(environment.api.prefix) < 0) {
      path = environment.api.prefix + path;
    }

    return path;
  }

  get(path: string, params: HttpParams | object = {}, options: { [key: string]: any } = {}): Observable<any> {
    const opt: { [key: string]: any } = Object.assign({}, options, {
      params
    });
    return this.http.get(BaseHttpClient.makePath(path), opt);
  }

  delete(path: string, params: HttpParams = new HttpParams(), options: object = {}): Observable<any> {
    return this.http.delete(BaseHttpClient.makePath(path), options);
  }

  post(path: string, body = {}, options = {}): Observable<any> {
    return this.http.post(BaseHttpClient.makePath(path), body, options);
  }

  put(path: string, body = {}, options = {}): Observable<any> {
    return this.http.put(BaseHttpClient.makePath(path), body, options);
  }

  multipartPost(path: string, formData: FormData): Observable<any> {
    return this.http.post(BaseHttpClient.makePath(path), formData);
  }

  getBinaryFile(path: string): Observable<any> {
    return this.http.get(BaseHttpClient.makePath(path), {responseType: 'blob'});
  }

}
