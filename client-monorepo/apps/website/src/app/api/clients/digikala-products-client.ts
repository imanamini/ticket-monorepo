import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DigikalaProductsClient extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getCreditDigikalaProducts(prefix: string, slug: string): Observable<any> {
    return super.get(`/api/website/digikala/products/${prefix}/${slug}`);
  }
}
