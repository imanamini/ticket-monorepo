import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { inject, Injectable } from '@angular/core';
import { CreditScoringSendOtpResponse } from '../models/credit-scoring/otp/credit-scoring-send-otp.response';
import { CreditSmcScoreStatusResponse } from '../models/credit/smc-score/credit-smc-score-status.response';
import { CreditSmcScoreDetailsResponse } from '../models/credit/smc-score/credit-smc-score-details.response';
import { GenericApiResponse } from '../models/generic-api-response.model';
import { map } from 'rxjs/operators';
import { FUND_PROVIDER_CODE } from '../models/credit/fund-provider/fund-provider-code';
import { CreditApiService } from './credit-api.service';

@Injectable({
  providedIn: 'root',
})
export class CreditScoringSmcApiService {
  private api = inject(BaseApiService);
  private creditApiService = inject(CreditApiService);

  getScoringStepSetting() {
    return this.creditApiService.getCreditScoreStepSetting();
  }

  getStatusSmc(creditId: string | null): Observable<CreditSmcScoreStatusResponse> {
    return this.api.get(`credit/smc/status/${creditId}`);
  }

  initSmc(creditId: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/smc/init/${creditId}`);
  }

  sendOtpSmcIcs(creditId: string, resend = false): Observable<CreditScoringSendOtpResponse> {
    return this.api.get(`credit/smc/ics/otp${resend ? '/resend' : ''}/${creditId}`);
  }

  verifyOtpSmcIcs(creditId: string, code: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/smc/ics/otp/verify/${creditId}`, {
      otp: code,
    });
  }

  getSmcDetails(creditId: string): Observable<CreditSmcScoreDetailsResponse> {
    return this.api.get(`credit/smc/detail/${creditId}`).pipe(
      map((response) => {
        if (response.fundProvider && response.fundProvider.color) {
          response.fundProvider.color = BaseApiService.convertDecimalToRgba(response.fundProvider.color);
        }
        if (response.fundProvider?.fundProviderCode === FUND_PROVIDER_CODE.DIGIPAY && response.installmentCount > 1) {
          response.installmentCount += 1;
        }
        return response;
      }),
    );
  }
}
