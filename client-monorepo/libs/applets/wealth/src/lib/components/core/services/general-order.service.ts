import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { paymentClientMetadataModel } from '../models/payment-client-metadata.model';
import {
  IS_HYBRID_API,
  PAYMENT_CLIENT_METADATA_API,
} from '../../../data-access/constants/api';

@Injectable({
  providedIn: 'root',
})
export class GeneralOrderService {
  constructor(private baseApiService: BaseApiService) {}

  // /api/v1 / order / is - hybrid

  isHybrid(orderId: string): Observable<boolean> {
    return this.baseApiService.get(IS_HYBRID_API + '?orderId=' + orderId);
  }

  paymentClientMetadata(
    orderId: string,
    refNumber: string,
  ): Observable<paymentClientMetadataModel> {
    return this.baseApiService.get(
      PAYMENT_CLIENT_METADATA_API +
        '?orderId=' +
        orderId +
        '&refNumber=' +
        refNumber,
    );
  }
}
