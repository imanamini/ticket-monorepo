import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenusResponse } from './models/layout/menus.response';

@Injectable({
  providedIn: 'root',
})
export class LayoutClient extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getMenus(): Observable<MenusResponse> {
    return super.get('/api/website/menus');
  }

  getCustomApi(api: string): Observable<any> {
    return super.get(api);
  }

  getUserIPData(): Observable<any> {
    return this.httpClient.get('https://freeipapi.com/api/json');
  }
}
