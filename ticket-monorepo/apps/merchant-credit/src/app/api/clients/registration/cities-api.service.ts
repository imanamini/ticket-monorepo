import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../base-http-client';
import { Observable } from 'rxjs';
import { Province } from '../../models/geo/province';

@Injectable({
  providedIn: 'root'
})
export class CitiesApiService extends BaseHttpClient {

  getBirthListOfCities(creditId: string): Observable<{ provinces: Province[] }> {
    return super.get(`merchant/credit/${creditId}/birth/cities`);
  }

  getPostalListOfCities(creditId: string): Observable<{ provinces: Province[] }> {
    return super.get(`merchant/credit/${creditId}/postal/cities`);
  }
}
