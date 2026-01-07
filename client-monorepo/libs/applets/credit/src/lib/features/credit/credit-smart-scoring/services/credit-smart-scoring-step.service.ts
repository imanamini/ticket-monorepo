import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditScoringSendOtpResponse } from '../../data-access/models/credit-scoring/otp/credit-scoring-send-otp.response';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { WalletCardService } from '../../data-access/services/wallet-card.service';
import { CreditTacService } from '../../wallet-activation/credit-tac.service';
import { MessageService } from '../../data-access/services/message.service';
import { CreditNavigationService } from '../../data-access/services/credit-navigation.service';
import { CreditSmartScoringConfigResponse } from '../../data-access/models/credit-smart-scoring/credit-smart-scoring-config.response';
import { PreSignupRequestPayload, UserType } from '../../data-access/models/credit-smart-scoring/pre-signup-request.payload';
import { CreditSmartScoringApiService } from '../../data-access/services/credit-smart-scoring-api.service';
import { CreditSmartScoringProfileDetailsResponse } from '../../data-access/models/credit-smart-scoring/credit-smart-scoring-profile-details.response';
import { GenericApiResponse } from '../../data-access/models/generic-api-response.model';
import { SMART_SCORING_STATUS_CODE } from './credit-smart-scoring-step-status';
import { CreditSmartScoringMaxBalanceResponse } from '../../data-access/models/credit-smart-scoring/credit-smart-scoring-max-balance.response';
import { CreditSmartScoringInitResponse } from '../../data-access/models/credit-smart-scoring/credit-smart-scoring-init.response';
import { CreditIcsSettingResponse } from '../../data-access/models/credit/score/credit-score-setting-response';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { CreditTrackerEvent, PageNameMapper } from './credit-tracker-event';
import { CreditUserService } from '../../data-access/services/credit-user.service';

export type SmartScoringStatusErrorType =
  | 'USER_HAVE_ON_GOING_PLAN'
  | 'USER_HAVE_ACTIVE_PLAN'
  | 'DP_SCORE_NOT_ENOUGH'
  | 'NATIONAL_CODE_DOES_NOT_MATCH_WITH_CELL_NUMBER'
  | 'USER_IN_BLACKLIST'
  | 'USER_IS_DECEASED'
  | 'USER_INVALID_BIRTH_DATE'
  | 'OTP_CODE_RESEND_EXCEEDED'
  | null;

const errorMapper: { [key: number]: SmartScoringStatusErrorType } = {
  [SMART_SCORING_STATUS_CODE.USER_HAVE_ON_GOING_PLAN]: 'USER_HAVE_ON_GOING_PLAN',
  [SMART_SCORING_STATUS_CODE.USER_HAVE_ACTIVE_PLAN]: 'USER_HAVE_ACTIVE_PLAN',
  [SMART_SCORING_STATUS_CODE.USER_IN_BLACKLIST]: 'USER_IN_BLACKLIST',
  [SMART_SCORING_STATUS_CODE.USER_IS_DECEASED]: 'USER_IS_DECEASED',
  [SMART_SCORING_STATUS_CODE.USER_INVALID_BIRTH_DATE]: 'USER_INVALID_BIRTH_DATE',
  [SMART_SCORING_STATUS_CODE.NATIONAL_CODE_DOES_NOT_MATCH_WITH_CELL_NUMBER]: 'NATIONAL_CODE_DOES_NOT_MATCH_WITH_CELL_NUMBER',
  [SMART_SCORING_STATUS_CODE.DP_SCORE_NOT_ENOUGH]: 'DP_SCORE_NOT_ENOUGH',
};

@Injectable()
export class CreditSmartScoringStepService {
  otpConfig = signal<
    | {
        needOtp: boolean;
        otpLength: number;
        otpCountDown: number;
        resendAvailable: boolean;
      }
    | undefined
  >(undefined);
  bottomSheetService = inject(NgxBottomSheetService);
  creditApiService = inject(CreditApiService);
  walletCardService = inject(WalletCardService);
  creditTacService = inject(CreditTacService);
  messageService = inject(MessageService);
  creditNavigationService = inject(CreditNavigationService);
  private waitingResult!: boolean;
  private userType: UserType = UserType.APP;
  private retryGettingReport = 1;
  private errorType = new BehaviorSubject<SmartScoringStatusErrorType>(null);
  private creditSmartScoringApiService = inject(CreditSmartScoringApiService);
  private creditUrlService = inject(CreditUrlService);
  private router = inject(Router);
  private eventService = inject(NgxEventTrackerService);
  private userService = inject(CreditUserService);

  clearConfig(): void {
    this.waitingResult = false;
  }

  clearErrorType(): void {
    this.errorType.next(null);
  }

  getRetryGettingReport(): number {
    return this.retryGettingReport;
  }

  getWaitingResult(): boolean {
    return this.waitingResult;
  }

  getErrorTypeValue(): SmartScoringStatusErrorType {
    return this.errorType.getValue();
  }

  getUserType(): UserType {
    return this.userType;
  }

  setWaitingResult(status: boolean): void {
    this.waitingResult = status;
  }

  setRetryGettingReport(retryNumber: number): void {
    this.retryGettingReport = retryNumber;
  }

  setUserType(userType: UserType): void {
    this.userType = userType;
  }

  setErrorTypeValue(value: SmartScoringStatusErrorType): void {
    this.errorType.next(value);
  }

  setErrorType(errorType: SMART_SCORING_STATUS_CODE): void {
    if (errorMapper[errorType]) {
      this.errorType.next(errorMapper[errorType]);
    } else {
      this.goToCreditHome('overview');
    }
  }

  getCreditMaxAvailableBalance(): Observable<CreditSmartScoringMaxBalanceResponse> {
    return this.creditSmartScoringApiService.smartScoringMaxAvailableBalance(this.userType);
  }

  getSmartScoringStatus(): Observable<CreditSmartScoringConfigResponse> {
    return this.creditSmartScoringApiService.getSmartScoringStatus(this.userType);
  }

  smartScoringOnboard(): Observable<any> {
    return this.creditSmartScoringApiService.smartScoringOnboard(this.userType);
  }

  initSmartScoringConfig(): Observable<CreditSmartScoringConfigResponse> {
    return this.creditSmartScoringApiService.initSmartScoringConfig(this.userType);
  }

  getScoringStepSetting(): Observable<CreditIcsSettingResponse> {
    return this.creditSmartScoringApiService.getScoringStepSetting();
  }

  getUserDetails(): Observable<CreditSmartScoringProfileDetailsResponse> {
    return this.creditSmartScoringApiService.getUserDetails();
  }

  verifyOtp(code: string): Observable<any> {
    return this.creditSmartScoringApiService.verifyOtp(code, this.userType);
  }

  resendOtp(): Observable<CreditScoringSendOtpResponse> {
    return this.creditSmartScoringApiService.resendOtp(this.userType);
  }

  goToCreditHome(type: 'resolve' | 'overview'): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/' + type));
  }

  submit(payload: PreSignupRequestPayload): Promise<void> {
    return new Promise((resolve, reject) => {
      this.creditSmartScoringApiService.preSignUpSubmit(payload, this.userType).subscribe({
        next: () => {
          this.walletCardService.clearCache();
          this.creditTacService.getData().subscribe((tacResponse) => {
            resolve();
            if (tacResponse.shouldAccept) {
              this.router
                .navigateByUrl(this.creditUrlService.getInnerServicePath('/wallet/tac'), {
                  state: {
                    destination: this.creditUrlService.getInnerServicePath(`/pre-register?userType=${this.userType}`),
                  },
                })
                .then();
            }
          });
        },
        error: (e: GenericApiResponse) => {
          if (e?.result?.status) {
            reject(e.result.status);
            return;
          }
          if (this.messageService.hasMessage(e)) {
            this.messageService.showErrorOfErrorResponse(e);
          } else {
            this.messageService.showErrorMessage('بروز خطا. لطفا مجددا تلاش کنید');
          }
        },
      });
    });
  }

  initSmartScoring(): Observable<CreditSmartScoringInitResponse> {
    return this.creditSmartScoringApiService.creditScoringInit(this.userType);
  }

  async sendEvent(creditTrackerEvent: CreditTrackerEvent) {
    const user = await this.userService.currentUser();
    const eventData = {
      event: creditTrackerEvent,
      page_name: PageNameMapper[creditTrackerEvent],
      user_id: user.userId,
    };
    this.eventService.sendEvent(eventData, { platforms: ['gtm'] });
  }
}
