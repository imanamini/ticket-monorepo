import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralResponse } from '../../models/api-result.model';
import { StateModel } from '../../models/renewal/state.model';
import { BrandModel } from '../../models/used/brand.model';
import { RegisterBodyModel } from '../../models/used/register-body.model';
import { SetPriceBodyModel } from '../../models/pricing/set-price-body.model';
import { GetPriceModel } from '../../models/renewal/get-price.model';
import { DiscountReserveBody } from '../../models/renewal/discount-reserve-body.model';
import { ReserveModel } from '../../models/renewal/reserve.model';
import { OrderModel } from '../../models/renewal/order.model';
import { PayRequestBodyModel } from '../../models/renewal/pay-request-body.model';
import { PayRequestModel } from '../../models/renewal/pay-request.model';
import { PaymentResultModel } from '../../models/renewal/payment-result.model';
import { HealthCheckBodyModel } from '../../models/renewal/health-check-body.model';
import { InformationBodyModel } from '../../models/used/information-body.model';
import { PurchaseListBodyModel } from '../../models/used/purchase-list-body.model';
import { PurchaseHistoryListModel } from '../../models/used/purchase-history-list.model';
import { RefundBodyModel } from '../../models/used/refund-body.model';
import { CheckDocumentModel } from '../../models/used/check-document.model';
import { ApiService } from '../../../../../data-access/services/api.service';
import {
  UsedCallbackModel
} from '../../../routes/used/steps/used-pre-payment/partials/payment-result-loading/models/used-callback.model';
import { DiscountCampaignModel } from '../../models/used/discount-campaign.model';
import { SaleChannelEnum } from '../../../shared-steps/models/sales-channel.enum';
import { UsedProductInfoModel } from '../../../routes/used/steps/used-pricing/models/used-product-info.model';
import {
  UsedPremiumCalculationModel
} from '../../../routes/used/steps/used-pricing/models/used-premium-calculation.model';

@Injectable({
  providedIn: 'root'
})
export class UsedApiService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getState(uniqueCode: string): Observable<GeneralResponse<StateModel[]>> {
    const params = new HttpParams().set('uniqueCode', uniqueCode);
    return super.get('/insurance/used/get-state', params);
  }

  getOrderInfo(uniqueCode: string): Observable<GeneralResponse<OrderModel>> {
    return super.post('/insurance/used/lead-view/' + uniqueCode);
  }

  /*
* Device Info **/

  purchaseList(body: PurchaseListBodyModel): Observable<GeneralResponse<PurchaseHistoryListModel[]>> {
    return this.post('insurance/unbundled/purchase-history-list', body);
  }

  searchBrands(query: string, category: string): Observable<GeneralResponse<BrandModel[]>> {
    return this.get('insurance/product-info/brands?q=' + query + '&cat=' + category);
  }

  searchModels(brandId: string, model: string): Observable<GeneralResponse<BrandModel[]>> {
    return this.get('insurance/product-info/brands/' + brandId + '/models?q=' + model);
  }

  getProductInfo(brandId: string, modelId: string): Observable<GeneralResponse<UsedProductInfoModel>> {
    return this.get(`insurance/product-info/brands/${brandId}/models/${modelId}/price`);
  }

  register(body: RegisterBodyModel): Observable<GeneralResponse<string>> {
    return this.post('insurance/used/register', body);
  }

  checkOrder(policyId: number | string): Observable<GeneralResponse<string>> {
    return super.get('/insurance/used/check-order?policyId=' + policyId);
  }

  /*
* Pricing **/
  setPrice(body: SetPriceBodyModel): Observable<GeneralResponse<any>> {
    return super.post('insurance/used/set-price', body);
  }

  getPrice(uniqueCode: string): Observable<GeneralResponse<GetPriceModel>> {
    return super.get('insurance/used/get-price?key=' + uniqueCode);
  }

  /*
* Pre Payment **/
  reserveDiscount(body: DiscountReserveBody): Observable<GeneralResponse<ReserveModel>> {
    return super.post('/insurance/used/discount/reserve', body);
  }

  reverseDiscount(key: string): Observable<GeneralResponse<OrderModel>> {
    return super.post('/insurance/used/discount/reverse', {key});
  }

  payRequest(body: PayRequestBodyModel): Observable<GeneralResponse<PayRequestModel>> {
    return super.post('/insurance/used/pay-request', body);
  }

  paymentResult(providerId: string): Observable<GeneralResponse<PaymentResultModel>> {
    return super.get('/insurance/used/payment-result?providerId=' + providerId);
  }

  healthCheckRefund(body: RefundBodyModel): Observable<GeneralResponse<RefundBodyModel>> {
    return super.post('/insurance/used/healthcheck-refund', body);
  }

  /*
* Health check **/
  setHealthCheck(body: HealthCheckBodyModel): Observable<GeneralResponse<any>> {
    return super.post('/insurance/used/healthcheck-result', body);
  }

  checkRedirectToHealthCheck(uniqueCode: string): Observable<GeneralResponse<boolean>> {
    return super.get('/insurance/used/redirect-to-healthcheck?key=' + uniqueCode);
  }

  /*
* Complete Information **/
  setInformation(body: InformationBodyModel): Observable<GeneralResponse<any>> {
    return super.post('/insurance/used/complete-info', body);
  }

  checkDocument(body: CheckDocumentModel): Observable<GeneralResponse<boolean>> {
    return super.post('/insurance/used/check-document ', body);
  }

  downloadPolicyPdf(policyNo): Observable<GeneralResponse<any>> {
    return super.get('/insurance/electronic-equipments/premium-pdf?policyNo=' + policyNo);
  }

  usedCallback(body: UsedCallbackModel): Observable<GeneralResponse<null>> {
    return super.post('/insurance/used/callBack', body);
  }

  getDiscountCampaign(saleChannel: SaleChannelEnum): Observable<GeneralResponse<DiscountCampaignModel>> {
    return super.get(`insurance/voucher/discount/campaign?saleChannel=${saleChannel}&api-version=1`);
  }

  getPremiumCalculation(body: UsedPremiumCalculationModel): Observable<GeneralResponse<UsedPremiumCalculationModel[]>> {
    return this.post('insurance/plan/premium-calculation?api-version=2', body);
  }
}
