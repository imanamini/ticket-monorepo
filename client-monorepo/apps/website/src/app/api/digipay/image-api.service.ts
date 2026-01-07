import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHttpClient } from '../base-http-client';

@Injectable({
  providedIn: 'root',
})
export class ImageApiService extends BaseHttpClient {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  getImage(id: string): Observable<any> {
    return super.get(
      `/files/${id}`,
      {},
      {
        responseType: 'blob',
      },
    );
  }
}
