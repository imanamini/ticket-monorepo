import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreditScoringApiService } from '../../../data-access/services/credit-scoring-api.service';
import { CreditUrlService } from '../../../data-access/utils/url';
import { Router } from '@angular/router';
import { GenericApiResponse } from '../../../data-access/models/generic-api-response.model';
import { CreditScoringSendOtpResponse } from '../../../data-access/models/credit-scoring/otp/credit-scoring-send-otp.response';
import { CreditScoringWithoutPayInitResponse } from '../../../data-access/models/credit-scoring/basic/credit-scoring-without-pay-init.response';
import { CreditScoringWithoutPayConfigResponse } from '../../../data-access/models/credit-scoring/basic/credit-scoring-without-pay-config.response';

export type errorType = 'FAILED' | 'SHAHKAR_FAILED' | 'UNREADY' | 'WHITE_LIST' | 'BLACK_LIST' | null;

@Injectable()
export class CreditScoringStepService {
  private waitingResult!: boolean;
  private trackingCode!: string | null;
  private fundProviderCode!: string;
  private creditId!: string;
  private errorType = new BehaviorSubject<errorType>(null);
  otpConfig = signal<{ needOtp: boolean; otpLength: number } | undefined>(undefined);

  private creditScoringApiService = inject(CreditScoringApiService);
  private creditUrlService = inject(CreditUrlService);
  private router = inject(Router);

  clearConfig(): void {
    this.waitingResult = false;
  }

  clearTrackingCode(): void {
    this.trackingCode = null;
  }

  clearErrorType(): void {
    this.errorType.next(null);
  }

  getCreditId(): string {
    return this.creditId;
  }

  getFundProviderCode(): string {
    return this.fundProviderCode;
  }

  getTrackingCode(): string | null {
    return this.trackingCode;
  }

  getWaitingResult(): boolean {
    return this.waitingResult;
  }

  getErrorTypeValue(): errorType {
    return this.errorType.getValue();
  }

  setCreditInfo(fundProviderCode: string, creditId: string): void {
    this.fundProviderCode = fundProviderCode;
    this.creditId = creditId;
  }

  setTrackingCode(trackingCode: string): void {
    this.trackingCode = trackingCode;
  }

  setWaitingResult(status: boolean): void {
    this.waitingResult = status;
  }

  setErrorTypeValue(value: errorType): void {
    this.errorType.next(value);
  }

  setErrorType(errorType: errorType): void {
    this.errorType.next(errorType);
  }

  getScoringConfig(creditId: string): Observable<CreditScoringWithoutPayConfigResponse> {
    return this.creditScoringApiService.getConfigWithoutPay(creditId);
  }

  initCreditScoring(): Observable<CreditScoringWithoutPayInitResponse> {
    this.setErrorType(null);
    return this.creditScoringApiService.initWithoutPay(this.creditId);
  }

  checkBlackList(): Observable<GenericApiResponse> {
    return this.creditScoringApiService.checkBlackList(this.creditId);
  }

  sendOtp(resend: boolean): Observable<CreditScoringSendOtpResponse> {
    return this.creditScoringApiService.sendOtpWithoutPay(this.creditId, resend);
  }

  closeFlow(): void {
    this.navigateToStep('');
  }

  goToNextCreditStep(): void {
    this.navigateToStep('/next');
  }

  goToCreditHome(type: 'resolve' | 'overview'): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/' + type));
  }

  private navigateToStep(pathSuffix: string): void {
    if (this.fundProviderCode && this.creditId) {
      this.router.navigateByUrl(
        this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}${pathSuffix}`),
      );
    } else {
      this.goToCreditHome('overview');
    }
  }
}
