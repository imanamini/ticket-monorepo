import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VoucherResponseModel } from '../../models/third-party/voucher/voucher-response.model';
import { UatGeneralResponse } from '../../models/uat-general.response';
import { BaseApiService } from '../shared/base-api.service';
import { PurchaseTicketTypeEnum } from '../../enums/purchase-ticket-type.enum';
import { ERROR_HANDLE_KEY, ErrorHandleHeaderEnum } from '../../../../../data-access/enums/error-handle-header.enum';

@Injectable({
  providedIn: 'root'
})
export class VoucherApiService extends BaseApiService {

  addVoucher(applicationFormId: string,
             discountCode: string,
             ticketType: PurchaseTicketTypeEnum): Observable<UatGeneralResponse<VoucherResponseModel>> {
    const headers: HttpHeaders = new HttpHeaders({[ERROR_HANDLE_KEY]: ErrorHandleHeaderEnum.NO_HANDLE});
    return super.put(`${this.baseUrl}application-forms/${applicationFormId}/reserve-discount?DiscountCode=${discountCode}&TicketType=${ticketType}`, {}, headers);
  }

  removeVoucher(applicationFormId: string): Observable<UatGeneralResponse<VoucherResponseModel>> {
    return super.put(`${this.baseUrl}application-forms/${applicationFormId}/reverse-discount`);
  }
}
