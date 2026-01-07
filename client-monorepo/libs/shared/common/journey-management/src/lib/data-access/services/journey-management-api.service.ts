import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NextActionApiResult } from '../models/na-backend.interface';

@Injectable({
  providedIn: 'root',
})
export class JourneyManagementApiService {
  apiService = inject(ApiService);
  httpClient = inject(HttpClient);

  getNextActions(): Observable<NextActionApiResult> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'app/dpx/next-action');
    return this.apiService.call(request);
  }
}
