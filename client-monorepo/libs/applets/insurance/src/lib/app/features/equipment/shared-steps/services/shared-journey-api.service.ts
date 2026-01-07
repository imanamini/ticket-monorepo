import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { RenewalApiService } from '../../api/services/renewal/renewal-api.service';
import { UsedApiService } from '../../api/services/used/used-api.service';
import { JourneyNamesModel } from '../models/journey-names.model';
import { GeneralResponse } from '../../api/models/api-result.model';
import { ApiService } from '../../../../data-access/services/api.service';
import { StateModel } from '../../api/models/renewal/state.model';
import { OrderModel } from '../../api/models/renewal/order.model';
import { RegisterBodyModel } from '../../api/models/used/register-body.model';
import { SetPriceBodyModel } from '../../api/models/pricing/set-price-body.model';
import { GetPriceModel } from '../../api/models/renewal/get-price.model';
import { DiscountReserveBody } from '../../api/models/renewal/discount-reserve-body.model';
import { ReserveModel } from '../../api/models/renewal/reserve.model';
import { PayRequestBodyModel } from '../../api/models/renewal/pay-request-body.model';
import { PayRequestModel } from '../../api/models/renewal/pay-request.model';
import { InformationBodyModel } from '../../api/models/used/information-body.model';
import { PaymentResultModel } from '../../api/models/renewal/payment-result.model';
import { HealthCheckBodyModel } from '../../api/models/renewal/health-check-body.model';

@Injectable({
  providedIn: 'root'
})
export class SharedJourneyApiService extends ApiService {
  private journeyBehaviorSubject: BehaviorSubject<JourneyNamesModel> = new BehaviorSubject<JourneyNamesModel>(JourneyNamesModel.RENEWAL);
  journey = this.journeyBehaviorSubject.getValue();

  constructor(private renewalApi: RenewalApiService,
              private usedApi: UsedApiService,
              private httpClient: HttpClient) {
    super(httpClient);
  }

  setJourney(value: JourneyNamesModel): void {
    this.journeyBehaviorSubject.next(value);
    this.journey = this.journeyBehaviorSubject.getValue();
  }

  getState(uniqueCode: string): Observable<GeneralResponse<StateModel[]>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.getState(uniqueCode);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.getState(uniqueCode);
    }
  }

  getOrderInfo(uniqueCode: string): Observable<GeneralResponse<OrderModel>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.getOrderInfo(uniqueCode);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.getOrderInfo(uniqueCode);
    }
  }

  register(body: RegisterBodyModel): Observable<GeneralResponse<string>> {
    if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.register(body);
    }
  }

  checkOrder(policyNo: string): Observable<GeneralResponse<string>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.checkOrder(policyNo);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.checkOrder(policyNo);
    }
  }

  /*
* Pricing **/
  setPrice(body: SetPriceBodyModel): Observable<GeneralResponse<any>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.setPrice(body);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.setPrice(body);
    }
  }

  getPrice(uniqueCode: string): Observable<GeneralResponse<GetPriceModel>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.getPrice(uniqueCode);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.getPrice(uniqueCode);
    }
  }

  /*
* Pre Payment **/
  reserveDiscount(body: DiscountReserveBody): Observable<GeneralResponse<ReserveModel>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.reserveDiscount(body);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.reserveDiscount(body);
    }
  }

  reverseDiscount(key: string): Observable<GeneralResponse<OrderModel>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.reverseDiscount(key);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.reverseDiscount(key);
    }
  }

  payRequest(body: PayRequestBodyModel): Observable<GeneralResponse<PayRequestModel>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.payRequest(body);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.payRequest(body);
    }
  }

  paymentResult(providerId: string): Observable<GeneralResponse<PaymentResultModel>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.paymentResult(providerId);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.paymentResult(providerId);
    }
  }

  /*
* Health check **/
  setHealthCheck(body: HealthCheckBodyModel): Observable<GeneralResponse<any>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.setHealthCheck(body);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.setHealthCheck(body);
    }
  }

  checkRedirectToHealthCheck(uniqueCode: string): Observable<GeneralResponse<boolean>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.checkRedirectToHealthCheck(uniqueCode);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.checkRedirectToHealthCheck(uniqueCode);
    }
  }

  /*
* Complete Information **/
  setInformation(body: InformationBodyModel): Observable<GeneralResponse<any>> {
    if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.setInformation(body);
    }
  }

  downloadPolicyPdf(policyNo): Observable<GeneralResponse<any>> {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return this.renewalApi.downloadPolicyPdf(policyNo);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return this.usedApi.downloadPolicyPdf(policyNo);
    }
  }
}
