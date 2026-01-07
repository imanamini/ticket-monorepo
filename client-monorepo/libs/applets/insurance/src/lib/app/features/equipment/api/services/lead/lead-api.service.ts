import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GeneralResponse } from '../../models/api-result.model';
import { HttpClient } from '@angular/common/http';
import { LeadModel } from '../../models/lead/lead.model';
import { DiscountReserveModel } from '../../models/lead/discount-reserve.model';
import { ApiService } from '../../../../../data-access/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LeadApiService extends ApiService {
  constructor(
    private httpClient: HttpClient,
  ) {
    super(httpClient);
  }

  getLeadInfo(leadCode: string): Observable<GeneralResponse<LeadModel>> {
    return super.get(`insurance/unbundled/lead-view/${leadCode}`);
  }

  payRequest(code: string): Observable<GeneralResponse<{ payUrl }>> {
    return super.post('insurance/unbundled/pay-request', {code});
  }

  removeDiscount(Key: string): Observable<GeneralResponse<DiscountReserveModel>> {
    return super.post('insurance/unbundled/discount/reverse', {Key});
  }

  addDiscount(Key: string, discountCode: string): Observable<GeneralResponse<DiscountReserveModel>> {
    return super.post('insurance/unbundled/discount/reserve', {Key, discountCode});
  }

  changeSerialNumber(Key: string, serialNo: string): Observable<GeneralResponse<DiscountReserveModel>> {
    return super.put('insurance/unbundled/serial-number', {Key, serialNo});
  }
}
