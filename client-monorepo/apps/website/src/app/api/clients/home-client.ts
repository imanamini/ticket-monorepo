import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeDataResponse } from './models/templates/home/home-data.response';

@Injectable({
  providedIn: 'root',
})
export class HomeClient extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getHomePageData(): Observable<HomeDataResponse> {
    return super.get('/api/website/home');
  }
}
