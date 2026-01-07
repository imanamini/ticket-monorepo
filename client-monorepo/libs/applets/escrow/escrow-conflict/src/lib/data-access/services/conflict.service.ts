import { Injectable, inject } from '@angular/core';
import { ApiService, GenericApiResponse, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { ConflictOrderRequest, ConflictResponse } from '../models/conflict.interface';

@Injectable({
  providedIn: 'root',
})
export class ConflictService {
  private apiService = inject(ApiService);

  getConflictReasons(): Observable<ConflictResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `escrow-channel/conflict-reasons`);
    return this.apiService.call<ConflictResponse>(request);
  }

  conflictOrder(data: ConflictOrderRequest): Observable<GenericApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'escrow-channel/user/orders/conflict', data);
    return this.apiService.call<GenericApiResponse>(request);
  }
}
