import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DownloadDataResponse } from './models/templates/download/download-data.response';

@Injectable({
  providedIn: 'root',
})
export class DownloadLinkClient extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getDownloadLinksData(): Observable<DownloadDataResponse> {
    return super.get('/api/website/download/channel');
  }
}
