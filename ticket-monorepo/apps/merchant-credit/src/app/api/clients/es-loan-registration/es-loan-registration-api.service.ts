import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpClient } from '../base-http-client';
import {
  EsLoanGetStepsResponse,
  EsLoanRules,
  GetEsLoanMerchantsResponse
} from './models/es-loan-get-steps.response';
import { GetSettlementRulesResponse } from '../early-settlement/response-models/get-settlement-rules.response';
import { GetSettlementPreviewResponse } from '../early-settlement/response-models/get-settlement-preview.response';
import { GetEsLoanSettlementResponse } from './models/es-loan-settlement.response';
import { FeeInitResponse } from '../early-settlement/response-models/fee-init.response';
import { EsLoanSendEmailResponse } from './models/es-loan-send-email.response';
import { EsLoanIcsSendOtpResponseInterface } from './models/es-loan-ics-send-otp.response.interface';

@Injectable({
  providedIn: 'root'
})
export class EsLoanRegistrationApiService extends BaseHttpClient {
  baseUrl: string = 'merchant/credit';

  getSteps(): Observable<EsLoanGetStepsResponse> {
    return super.get(`${this.baseUrl}/es-loan/steps`);
  }

  getRegistrationIdFromDetail(): Observable<any> {
    return super.get(`${this.baseUrl}/ticket-info/detail`);
  }

  getRules(registrationId: string): Observable<EsLoanRules> {
    return super.get(`${this.baseUrl}/rules/${registrationId}`,);
  }

  assignRule(registrationId: string, ruleId: string | undefined): Observable<{ creditId: string }> {
    return super.post(`${this.baseUrl}/${registrationId}/rule`, {
      ruleId
    });
  }

  getMerchants(): Observable<GetEsLoanMerchantsResponse> {
    return super.get('credit/merchants');
  }

  getSettlementRules(registrationId: string, trackingCode: string): Observable<GetSettlementRulesResponse> {
    return super.get(`${this.baseUrl}/rules/${registrationId}/fund-providers/${trackingCode}`);
  }

  getSettlement(registrationId: string): Observable<GetEsLoanSettlementResponse> {
    return super.post(`${this.baseUrl}/es-loan/settlements/${registrationId}/initiate`);
  }

  getPreview(trackingCode: string, amount: number, ruleId: string): Observable<GetSettlementPreviewResponse> {
    return super.post(`${this.baseUrl}/settlements/${trackingCode}/preview`, {amount, ruleId});
  }

  settlementFeeInit(trackingCode: string, amount: number, ruleId: string): Observable<FeeInitResponse> {
    return super.put(`${this.baseUrl}/settlements/${trackingCode}/fee/init`, {
      updatedAmount: amount,
      ruleId: ruleId
    });
  }

  sendEmail(trackingCode: string): Observable<EsLoanSendEmailResponse> {
    return super.put(`${this.baseUrl}/es-loan/mail-cheque`, {
      trackingCode: trackingCode
    });
  }

  sendOtp(registrationId: string): Observable<EsLoanIcsSendOtpResponseInterface> {
    return super.post(`${this.baseUrl}/es-loan/ics/${registrationId}/send-otp`);
  }

  getOtp(trackingCode: string, code: string): Observable<EsLoanIcsSendOtpResponseInterface> {
    return super.post(`${this.baseUrl}/es-loan/ics/${trackingCode}`, {
      'otp': code
    });
  }

}
