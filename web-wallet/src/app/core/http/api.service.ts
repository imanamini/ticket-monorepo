import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient
  ) {
  }

  private getHeaders() {
    const headers = new HttpHeaders();

    return headers;
  }

  getText(path: string): Observable<any> {
    return this.http.get(this.makePath(path), {
      responseType: 'text',
      headers: {
        Accept: 'text/html,application/xhtml+xml;'
      }
    });
  }

  makePath(path) {
    if (path.indexOf('http') >= 0) {
      // url is absolute, like TAC features urls
      return path;
    }

    if (path.charAt(0) !== '/') {
      path = '/' + path;
    }
    return environment.api_prefix + path;
  }

  get(path: string, params = {}, options: object = {}): Observable<any> {
    path = this.makePath(path);
    // @ts-ignore
    return this.http.get(path, Object.assign({
      headers: this.getHeaders(),
      responseType: 'json',
      params,
    }, options));
  }

  post(path: string, body: object = null, options: object = {}): Observable<any> {
    path = this.makePath(path);
    // @ts-ignore
    return this.http.post(path, body, Object.assign({
      headers: this.getHeaders(),
      responseType: 'json',
    }, options));
  }

  getImage(id: string, ticket?: string): Observable<any> {
    const headers = ticket ? {ticket} : {}
    return this.http.get(this.makePath(`files/${id}`), {responseType: 'blob', headers});
  }
}
