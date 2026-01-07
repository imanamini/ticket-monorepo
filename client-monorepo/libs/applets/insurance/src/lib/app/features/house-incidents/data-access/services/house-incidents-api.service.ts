import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HouseAvailableProductModel } from '../../features/plp/data-access/models/house-incident-product-card.model';
import { BaseApiService } from '../../../vehicle/data-access/services/shared/base-api.service';
import { UatGeneralResponse } from '../../../vehicle/data-access/models/uat-general.response';
import {
  HouseIncidentGoToPaymentModel,
  HouseIncidentGoToPaymentResponseModel,
} from '../../features/plp/data-access/models/house-incident-go-to-payment.model';
import { HouseIncidentPaymentResultModel } from '../../features/plp/data-access/models/house-incident-payment-result.model';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { PolicyUserInfoModel } from '../../features/complete-journey/model/policy-user-info.model';
import { HouseIncidentCompleteInfoModel } from '../../features/complete-journey/model/house-incident-user-info-form.model';
import { HouseIncidentListResponseModel } from '../../../../data-access/models/house-incident-list.model';
import { HouseIncidentsOrderJourneyTypeModel } from '../../features/plp/data-access/models/house-incidents-order-journey-type.model';
import { ERROR_HANDLE_KEY, ErrorHandleHeaderEnum } from '../../../../data-access/enums/error-handle-header.enum';
import { OrderAndFilterParametersModel } from '../../../../data-access/models/order-and-filter-parameters.model';

@Injectable({
  providedIn: 'root',
})
export class HouseIncidentsApiService extends BaseApiService {
  public readonly FRAGMENT_PREPAYMENT = 'prepayment';
  public hybridService = inject(NgxHybridService);

  constructor(http: HttpClient) {
    super(http);
  }

  getProducts(applicationId: string): Observable<UatGeneralResponse<HouseAvailableProductModel>> {
    return super.post(this.baseUrl + 'accident-application-forms/' + applicationId + '/available-products');
  }

  getPolicyUserInfo(applicationId: string): Observable<UatGeneralResponse<PolicyUserInfoModel>> {
    return super.get(this.baseUrl + 'accident-application-forms/' + applicationId);
  }

  orderDraft(plan: string, applicationFormId: string): Observable<UatGeneralResponse<HouseAvailableProductModel>> {
    return super.put(this.baseUrl + 'accident-application-forms/' + applicationFormId + '/draft', { plan });
  }

  orderJourneyType(applicationFormId: string, journeyType: string): Observable<UatGeneralResponse<HouseIncidentsOrderJourneyTypeModel>> {
    return super.post(this.baseUrl + 'accident-application-forms', { applicationFormId, journeyType });
  }

  downloadPolicy(applicationId: string): Observable<HttpResponse<Blob>> {
    return super.get(`${this.baseUrl}profile/accident-application-forms/download-policy?uniqueCode=${applicationId}`, null, null, {
      observe: 'response',
      responseType: 'blob',
      reportProgress: true,
    });
  }

  goToPayment(appId: string, data: HouseIncidentGoToPaymentModel): Observable<UatGeneralResponse<HouseIncidentGoToPaymentResponseModel>> {
    return this.post(`${this.baseUrl}accident-application-forms/${appId}/payments/request`, data);
  }

  completeUserInfo(appId: string, data: HouseIncidentCompleteInfoModel): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ [ERROR_HANDLE_KEY]: ErrorHandleHeaderEnum.NO_HANDLE });
    return this.put(`${this.baseUrl}accident-application-forms/${appId}/insured-parties`, data, headers);
  }

  getPaymentResult(providerId: string): Observable<UatGeneralResponse<HouseIncidentPaymentResultModel>> {
    return this.get(`${this.baseUrl}accident-application-forms/payments/${providerId}/result`);
  }

  checkHybridPayment(providerId: string): Observable<UatGeneralResponse<string>> {
    return this.get(`${this.baseUrl}accident-application-forms/payments/${providerId}/check-hybrid`);
  }

  getPolicies(data: OrderAndFilterParametersModel): Observable<UatGeneralResponse<HouseIncidentListResponseModel>> {
    return super.post(this.baseUrl + 'profile/accident-application-forms/list', data);
  }

  addVoucher(applicationFormId: string, discountCode: string): Observable<UatGeneralResponse<any>> {
    const headers: HttpHeaders = new HttpHeaders({ [ERROR_HANDLE_KEY]: ErrorHandleHeaderEnum.NO_HANDLE });
    return super.put(
      `${this.baseUrl}accident-application-forms/${applicationFormId}/reserve-discount?DiscountCode=${discountCode}&TicketType=0`,
      {},
      headers,
    );
  }

  removeVoucher(applicationFormId: string): Observable<UatGeneralResponse<any>> {
    return super.put(`${this.baseUrl}accident-application-forms/${applicationFormId}/reverse-discount`);
  }
}
