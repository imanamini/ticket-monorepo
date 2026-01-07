import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResolverModel } from '../models/resolver.model';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from '../../../vehicle/data-access/services/shared/base-api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResolverService extends BaseApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getStateResolver(): Observable<IResolverModel> {
    return super.post(this.baseUrl + 'resolver', {}).pipe(map((res) => res.result as IResolverModel));
  }
}
