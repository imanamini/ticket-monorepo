import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseHttpClient } from '../../../api/clients/base-http-client';
import { GetTicketDetailResponse } from '../../../api/clients/registration/response-models/get-ticket-detail.response';
import { RulesResponse } from '../../../api/models/registration/rules/rules.response';
import { MOCK_TICKET_INFO } from './ticket-info';
import { MOCK_RULES } from './rules';
import { MOCK_ASSIGN_RESPONSE } from './assign';
import { GetStepsResponse } from '../../../api/clients/registration/response-models/get-steps.response';
import { MOCK_STEPS } from './steps';
import { Merchant } from '../../../api/models/registration/merchant';
import { BaseApiResponse } from '../../../api/models/base-api.response';
import { PaymentDetailItem } from '../../../api/models/registration/payment/payment-detail';
import { PaymentInitResponse } from '../../../api/models/payment/payment-init.response';

@Injectable({
  providedIn: 'root'
})
export class RegistrationMockApiService extends BaseHttpClient {

  getTicketDetail(): Observable<GetTicketDetailResponse> {
    return of(MOCK_TICKET_INFO) as Observable<GetTicketDetailResponse>;
  }

  // getRules(registrationId: string): Observable<RulesResponse> {
  //   return of(MOCK_RULES) as Observable<RulesResponse>;
  // }

  // assignRule(registrationId: string): Observable<{ creditId: string }> {
  //   return of(MOCK_ASSIGN_RESPONSE) as Observable<{ creditId: string }>;
  // }

  getSteps(creditId: string): Observable<GetStepsResponse> {
    // @ts-ignore
    return of(MOCK_STEPS) as Observable<GetStepsResponse>;
  }

  getMerchants(): Observable<{ merchants: Merchant[] }> {
    return super.get('credit/merchants');
  }

  reviseMaxAmount(registrationId: string, maxAmount: number): Observable<BaseApiResponse> {
    return super.put(`credit/merchants/${registrationId}/max-amount`, {maxAmount});
  }

  initializePayment(creditId: string): Observable<{ trackingCode: string }> {
    return super.put(`credit/merchants/${creditId}/payment/init`);
  }

  getPaymentDetails(id: string): Observable<{ details: PaymentDetailItem[] }> {
    return super.get(`credit/merchants/payment/${id}/detail`);
  }

  getTicketForPayment(trackingCode: string, callbackUrl: string): Observable<PaymentInitResponse> {
    return super.post(`payments/init`, {
      trackingCode,
      callbackUrl,
    });
  }

  initializeIdentityEvaluation(creditId: string, birthDate: string): Observable<any> {
    return of({
      'result': {
        'title': 'SUCCESS',
        'status': 0,
        'message': 'عملیات با موفقیت انجام شد',
        'level': 'INFO'
      }
    });
  }

  resendOtp(creditId: string): Observable<any> {
    return of({
      'result': {
        'title': 'SUCCESS',
        'status': 0,
        'message': 'عملیات با موفقیت انجام شد',
        'level': 'INFO'
      }
    });
  }

  verifyOtp(creditId: string, code: string): Observable<any> {
    return of({
      'result': {
        'title': 'SUCCESS',
        'status': 0,
        'message': 'عملیات با موفقیت انجام شد',
        'level': 'INFO'
      },
      'status': 5
    });
  }

}
