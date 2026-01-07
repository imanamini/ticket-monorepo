import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { CreditScoringConfigResponse } from '../models/credit-scoring/basic/credit-scoring-config.response';
import {
  BeforeTransformationGetCreditScoringConfigResponse,
  GetCreditScoringConfigResponse,
} from '../models/credit-scoring/otp/get-credit-scoring-config.response';
import { CreditScoringInitResponse } from '../models/credit-scoring/basic/credit-scoring-init.response';
import { CreditScoringPayUrlResponse } from '../models/credit-scoring/payment/credit-scoring-pay-url.response';
import { CreditScoringSendOtpResponse } from '../models/credit-scoring/otp/credit-scoring-send-otp.response';
import { CreditReportResponse } from '../models/credit-scoring/credit-report-response';
import { CreditScoringWithoutPayConfigResponse } from '../models/credit-scoring/basic/credit-scoring-without-pay-config.response';
import { CreditScoringWithoutPayInitResponse } from '../models/credit-scoring/basic/credit-scoring-without-pay-init.response';
import { CreditScoringInquiryResponse } from '../models/credit-scoring/basic/credit-scoring-inquiry.response';
import { GenericApiResponse } from '../models/generic-api-response.model';
import { CreditScoringSuggestedPlansResponse } from '../models/credit-scoring/basic/credit-scoring-suggested-plans.response';
import { CreditApiService } from './credit-api.service';

@Injectable({
  providedIn: 'root',
})
export class CreditScoringApiService {
  constructor(
    private api: BaseApiService,
    private creditApiService: CreditApiService,
  ) {}

  getScoringStepSetting() {
    return this.creditApiService.getCreditScoreStepSetting();
  }

  getCreditScoringConfig(): Observable<CreditScoringConfigResponse> {
    return this.api.get('national-credit/configs');
  }

  getOtpConfig(): Observable<GetCreditScoringConfigResponse> {
    return this.api.get('national-credit/configs/otp').pipe(
      map((response: BeforeTransformationGetCreditScoringConfigResponse) => {
        return {
          otpLength: response.otpDigits,
          cancelInfo: {
            title: response.cancelInquiryInfo.title,
            header: response.cancelInquiryInfo.header,
            description: response.cancelInquiryInfo.description,
            descriptionColor: response.cancelInquiryInfo.descriptionColor,
            rejectButtonText: 'ادامه فرآیند',
            buttonText: response.cancelInquiryInfo.title,
          },
        };
      }),
    );
  }

  creditScoringInit(nationalCode: string, redirectUrl: string, urlAfterResult: string): Observable<CreditScoringInitResponse> {
    return this.api.post('national-credit/init', {
      nationalCode,
      redirectUrl,
      redirectDetailAfterResult: {
        text: 'ادامه فرآیند',
        method: 1,
        path: urlAfterResult,
      },
    });
  }

  getPayUrl(trackingCode: string): Observable<CreditScoringPayUrlResponse> {
    return this.api.get(`national-credit/pay-detail/${trackingCode}`);
  }

  creditScoringSendOtp(trackingCode: string, resend = false): Observable<CreditScoringSendOtpResponse> {
    return this.api.post(`national-credit/otp${resend ? '/resend' : ''}`, {
      trackingCode,
    });
  }

  getReportDetail(
    trackingCode: string,
    otp: string | null = null,
    type: 'with-pay' | 'without-pay' = 'with-pay',
  ): Observable<CreditReportResponse> {
    const urlMap = {
      'without-pay': 'credit/score/ics/report/' + trackingCode,
      'with-pay': 'national-credit/detail/' + trackingCode + (otp ? '?otp=' + otp : ''),
    };
    return this.api.get(urlMap[type]).pipe(
      map((response: CreditReportResponse) => {
        if (response.summary) {
          if (response.summary.spectrum && response.summary.spectrum.length > 0) {
            // API returns -3 as a spectrum item
            // Remove negative ranges
            response.summary.spectrum = response.summary.spectrum.filter((s, index) => {
              return s.min >= 0;
            });
          }
        }

        return response;
      }),
    );
  }

  getConfigWithoutPay(creditId: string): Observable<CreditScoringWithoutPayConfigResponse> {
    return this.api.get(`credit/scores/on-board/${creditId}`);
  }

  initWithoutPay(creditId: string): Observable<CreditScoringWithoutPayInitResponse> {
    return this.api.post(`credit/scores/init/${creditId}`);
  }

  inquiryWithoutPay(creditId: string): Observable<CreditScoringInquiryResponse> {
    return this.api.post(`credit/scores/inquiry/${creditId}`);
  }

  getSuggestedPlans(creditId: string): Observable<CreditScoringSuggestedPlansResponse> {
    return this.api.get(`credit/offer/plans/${creditId}`);
  }

  sendOtpWithoutPay(creditId: string, resend = false): Observable<CreditScoringSendOtpResponse> {
    return this.api.get(`credit/scores/otp${resend ? '/resend' : ''}/${creditId}`);
  }

  verifyOtpWithoutPay(creditId: string, code: string): Observable<any> {
    return this.api.post(`credit/scores/otp/verify/${creditId}`, { otp: code });
  }

  checkBlackList(creditId: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/scores/check-blacklist/${creditId}`, {});
  }
}
