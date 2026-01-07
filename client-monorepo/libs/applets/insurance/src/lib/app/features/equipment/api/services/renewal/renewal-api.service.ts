import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralResponse } from '../../models/api-result.model';
import { StateModel } from '../../models/renewal/state.model';
import { OrderModel } from '../../models/renewal/order.model';
import { PayRequestBodyModel } from '../../models/renewal/pay-request-body.model';
import { PayRequestModel } from '../../models/renewal/pay-request.model';
import { DiscountReserveBody } from '../../models/renewal/discount-reserve-body.model';
import { SetSerialBodyModel } from '../../models/renewal/set-serial-body.model';
import { PaymentResultModel } from '../../models/renewal/payment-result.model';
import { HealthCheckBodyModel } from '../../models/renewal/health-check-body.model';
import { ReserveModel } from '../../models/renewal/reserve.model';
import { SetPriceBodyModel } from '../../models/pricing/set-price-body.model';
import { GetPriceModel } from '../../models/renewal/get-price.model';
import { RefundBodyModel } from '../../models/used/refund-body.model';
import { ApiService } from '../../../../../data-access/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RenewalApiService extends ApiService {
  constructor(
    private httpClient: HttpClient,
  ) {
    super(httpClient);
  }

  getState(uniqueCode: string): Observable<GeneralResponse<StateModel[]>> {
    const params = new HttpParams().set('uniqueCode', uniqueCode);
    return super.get('/insurance/renewal/get-state', params);
  }

  getOrderInfo(uniqueCode: string): Observable<GeneralResponse<OrderModel>> {
    return super.post('/insurance/renewal/order-view/' + uniqueCode);
  }

  acceptInfo(uniqueCode: string): Observable<GeneralResponse<any>> {
    return super.post('/insurance/renewal/accept-info', {key: uniqueCode});
  }

  checkOrder(policyNo: number | string): Observable<GeneralResponse<string>> {
    return super.get('/insurance/renewal/check-order?policyNo=' + policyNo);
  }

  /*
  * Pricing **/
  setPrice(body: SetPriceBodyModel): Observable<GeneralResponse<any>> {
    return super.post('insurance/renewal/set-price', body);
  }

  getPrice(uniqueCode: string): Observable<GeneralResponse<GetPriceModel>> {
    return super.get('insurance/renewal/get-price?key=' + uniqueCode);
  }

  /*
  * Pre Payment **/
  reserveDiscount(body: DiscountReserveBody): Observable<GeneralResponse<ReserveModel>> {
    return super.post('/insurance/renewal/discount/reserve', body);
  }

  reverseDiscount(key: string): Observable<GeneralResponse<OrderModel>> {
    return super.post('/insurance/renewal/discount/reverse', {key});
  }

  payRequest(body: PayRequestBodyModel): Observable<GeneralResponse<PayRequestModel>> {
    return super.post('/insurance/renewal/pay-request', body);
  }

  paymentResult(providerId: string): Observable<GeneralResponse<PaymentResultModel>> {
    return super.get('/insurance/renewal/payment-result?providerId=' + providerId);
  }

  setHealthCheck(body: HealthCheckBodyModel): Observable<GeneralResponse<any>> {
    return super.post('/insurance/renewal/healthcheck-result', body);
  }

  checkRedirectToHealthCheck(uniqueCode: string): Observable<GeneralResponse<boolean>> {
    return super.get('/insurance/renewal/redirect-to-healthcheck?key=' + uniqueCode);
  }

  healthCheckRefund(body: RefundBodyModel): Observable<GeneralResponse<any>> {
    return super.post('/insurance/renewal/cancel', body);
  }

  /*
  * Complete Information **/
  setSerial(body: SetSerialBodyModel): Observable<GeneralResponse<any>> {
    return super.post('/insurance/renewal/set-serial', body);
  }

  getSerial(uniqueCode: string): Observable<GeneralResponse<any>> {
    return super.get('/insurance/renewal/get-serial?key=' + uniqueCode);
  }

  downloadPolicyPdf(policyNo): Observable<GeneralResponse<any>> {
    return super.get('/insurance/electronic-equipments/premium-pdf?policyNo=' + policyNo);
  }
}
