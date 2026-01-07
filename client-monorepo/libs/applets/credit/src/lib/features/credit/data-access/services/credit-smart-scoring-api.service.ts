import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { CreditScoringSendOtpResponse } from '../models/credit-scoring/otp/credit-scoring-send-otp.response';
import { CreditApiService } from './credit-api.service';
import { CreditSmartScoringConfigResponse } from '../models/credit-smart-scoring/credit-smart-scoring-config.response';
import { PreSignupRequestPayload, UserType } from '../models/credit-smart-scoring/pre-signup-request.payload';
import { CreditSmartScoringProfileDetailsResponse } from '../models/credit-smart-scoring/credit-smart-scoring-profile-details.response';
import { CreditSmartScoringMaxBalanceResponse } from '../models/credit-smart-scoring/credit-smart-scoring-max-balance.response';
import { CreditSmartScoringInitResponse } from '../models/credit-smart-scoring/credit-smart-scoring-init.response';
import { CreditIcsSettingResponse } from '../models/credit/score/credit-score-setting-response';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CreditSmartScoringApiService {
  constructor(
    private api: BaseApiService,
    private creditApiService: CreditApiService,
  ) {}

  userTypeHeader(userType: UserType): HttpHeaders {
    return new HttpHeaders({ 'User-Type': userType });
  }

  getSmartScoringStatus(userType: UserType): Observable<CreditSmartScoringConfigResponse> {
    return this.api.get(`credit/pre-sign-up/status`, undefined, this.userTypeHeader(userType));
  }

  initSmartScoringConfig(userType: UserType): Observable<CreditSmartScoringConfigResponse> {
    return this.api.post(`credit/pre-sign-up/init`, undefined, this.userTypeHeader(userType));
  }

  smartScoringMaxAvailableBalance(userType: UserType): Observable<CreditSmartScoringMaxBalanceResponse> {
    return this.api.get(`credit/plans/max-balance`, undefined, this.userTypeHeader(userType));
  }

  smartScoringOnboard(userType: UserType): Observable<any> {
    return this.api.post(`credit/pre-sign-up/on-board`, undefined, this.userTypeHeader(userType));
  }

  getUserDetails(): Observable<CreditSmartScoringProfileDetailsResponse> {
    return this.api.get('credit/pre-sign-up/detail');
  }

  preSignUpSubmit(request: PreSignupRequestPayload, userType: UserType): Observable<any> {
    return this.api.post(`credit/pre-sign-up`, request, this.userTypeHeader(userType));
  }

  getScoringStepSetting(): Observable<CreditIcsSettingResponse> {
    return this.creditApiService.getCreditScoreStepSetting();
  }

  creditScoringInit(userType: UserType): Observable<CreditSmartScoringInitResponse> {
    return this.api.post(`credit/pre-sign-up/init/ics`, undefined, this.userTypeHeader(userType));
  }

  resendOtp(userType: UserType): Observable<CreditScoringSendOtpResponse> {
    return this.api.post(`credit/pre-sign-up/otp/resend`, undefined, this.userTypeHeader(userType));
  }

  verifyOtp(code: string, userType: UserType): Observable<any> {
    return this.api.post(`credit/pre-sign-up/otp/validate`, { otp: code }, this.userTypeHeader(userType));
  }
}
