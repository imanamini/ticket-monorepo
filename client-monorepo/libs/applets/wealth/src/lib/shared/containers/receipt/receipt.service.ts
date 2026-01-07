import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IReceipt } from '../../../data-access/models/receipt.interface';
import { API } from '../../../data-access/constants/api';
import { BaseApiService } from '../../../components/core/services/base-api.service';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { CacheHandlerService } from '../../../components/core/services/v1/cache-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private baseApiService = inject(BaseApiService);
  private cacheHandlerService = inject(CacheHandlerService);

  getReceiptData(uniqueId: string): Observable<TServiceResult<IReceipt>> {
    const key = this.cacheHandlerService.getKey('receipt', uniqueId);
    return this.cacheHandlerService.getOrFetch(key, () => this.baseApiService.get(API.transactions.base + `/${uniqueId}`));
  }
}
