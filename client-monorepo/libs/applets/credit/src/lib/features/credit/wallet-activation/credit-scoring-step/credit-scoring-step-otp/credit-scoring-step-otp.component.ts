import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditNeoWarningDialogComponent } from '../../../components/credit-neo-warning-dialog/credit-neo-warning-dialog.component';
import { CreditScoringApiService } from '../../../data-access/services/credit-scoring-api.service';
import { CreditUserService } from '../../../data-access/services/credit-user.service';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditLocationTrapComponent } from '../../../components/credit-location-trap/credit-location-trap.component';
import { CreditInPageOtpComponent } from '../../../components/credit-in-page-otp/credit-in-page-otp.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditScoringStepService } from '../services/credit-scoring-step.service';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { SCORING_STATUS_CODE } from '../services/credit-scoring-step-status';
import { CreditScoringStepType } from '../services/credit-scoring-step.type';
import { CreditScoringWithoutPayConfigResponse } from '../../../data-access/models/credit-scoring/basic/credit-scoring-without-pay-config.response';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditScoringTimeLimitationComponent } from '../../credit-scoring-shared/credit-scoring-time-limitation/credit-scoring-time-limitation.component';
import { CreditIcsSettingResponse } from '../../../data-access/models/credit/score/credit-score-setting-response';

@Component({
  selector: 'app-credit-scoring-step-otp',
  templateUrl: './credit-scoring-step-otp.component.html',
  styleUrls: ['./credit-scoring-step-otp.component.scss'],
  standalone: true,
  imports: [
    CreditLocationTrapComponent,
    CreditInPageOtpComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    NgxStatusResultModule,
    CreditScoringTimeLimitationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringStepOtpComponent implements OnInit {
  OTP_COUNT_DOWN_STORAGE_KEY = 'credit_cs_otp_count_down';
  OTP_RESEND_AVAILABLE = 'credit_cs_resend_available';
  trackingCode!: string | null;
  creditId!: string;
  otpDescription = 'برای مشاهده گزارش اعتبارسنجی، کد ارسال شده به شماره همراه زیر را وارد کنید.';
  warningText = {
    title: 'توجه!',
    message: 'لطفاً تا تایید کد از این صفحه خارج نشوید.',
  };
  creditScoringConfig = input<CreditScoringWithoutPayConfigResponse>();

  verifyingCode = signal(false);
  otpClearSignal = signal(0);
  cellNumber = signal<string | null>(null);
  otpCountDown = signal(120);
  resendAvailable = signal<boolean | null>(null);
  gettingApiCount = signal<number | null>(null);
  loading = signal(true);
  otpError = signal<string | null>(null);
  timeLimitedData = signal<CreditIcsSettingResponse | undefined>(undefined);
  timeLimited = signal(false);

  onNext = output<void>();
  goToStep = output<CreditScoringStepType>();

  private creditScoringService = inject(CreditScoringStepService);
  private messageService = inject(MessageService);
  private userService = inject(CreditUserService);
  private creditScoringApiService = inject(CreditScoringApiService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private CreditScoringStepService = inject(CreditScoringStepService);

  cancelInfo = computed(() => this.creditScoringConfig()?.cancelInfo);
  showResend = computed(() => !!this.creditScoringConfig());
  otpCodeLength = computed(() => this.CreditScoringStepService.otpConfig()?.otpLength || 4);

  ngOnInit() {
    this.getScoreSetting();
  }

  getScoreSetting() {
    this.creditScoringApiService.getScoringStepSetting().subscribe({
      next: (response) => {
        this.timeLimited.set(!!response?.limitted);
        this.timeLimitedData.set(response);
        this.loading.set(false);
        if (!response?.limitted) {
          this.initData();
        }
      },
    });
  }

  initData() {
    this.trackingCode = this.creditScoringService.getTrackingCode();
    this.creditId = this.creditScoringService.getCreditId();
    this.gettingApiCount.set(3);
    this.sendCode(false).then(() => {
      this.gettingApiCount.update((count) => count! - 1);
    });
    this.getServiceData();
    const otpData = this.getOtpData();
    this.otpCountDown.set(otpData.otpCountDown);
    this.resendAvailable.set(otpData.resendAvailable);
    this.gettingApiCount.update((count) => count! - 1);
  }

  getServiceData() {
    this.userService.currentUser().then((user) => {
      this.cellNumber.set(user.cellNumber);
      this.gettingApiCount.update((count) => count! - 1);
    });
  }

  verifyOtp(code: any) {
    this.otpError.set(null);
    this.creditScoringService.clearErrorType();
    this.verifyingCode.set(true);
    this.creditScoringApiService.verifyOtpWithoutPay(this.creditId, code).subscribe({
      next: () => {
        this.verifyingCode.set(false);
        this.onNext.emit();
      },
      error: (error) => {
        // handle an async report: CREDIT_SCORE_ICS_SCORE_UNREADY(16514)
        if (error && error.result && error.result.status === SCORING_STATUS_CODE.SCORING_UNREADY) {
          this.verifyingCode.set(false);
          this.goToStep.emit(CreditScoringStepType.RESULT);
          return;
        }
        if (error && error.result && error.result.status === SCORING_STATUS_CODE.SHAHKAR_FAILED) {
          this.verifyingCode.set(false);
          this.creditScoringService.setErrorTypeValue('SHAHKAR_FAILED');
          this.goToStep.emit(CreditScoringStepType.RESULT);
          return;
        }
        if (error && error.result && error.result.status === SCORING_STATUS_CODE.WRONG_OTP_CODE) {
          this.verifyingCode.set(false);
          this.otpError.set(error.result.message);
          return;
        }
        this.otpClearSignal.update((ocs) => ocs + 1);
        this.verifyingCode.set(false);
        this.handleError(error);
      },
    });
  }

  sendCode(resend = true) {
    return new Promise<void>((resolve, reject) => {
      this.creditScoringService.sendOtp(resend).subscribe({
        next: (response) => {
          this.otpCountDown.set(response.otpCountDown);
          this.resendAvailable.set(response.resendAvailable);
          this.storeOtpData(response.otpCountDown, response.resendAvailable);
          resolve();
        },
        error: (error) => {
          this.handleError(error);
          reject(error);
        },
      });
    });
  }

  sendNewCode() {
    if (!this.resendAvailable()) {
      this.openSupportDialog();
    } else {
      this.sendCode(true).then(() => {});
    }
  }

  goBack() {
    if (this.timeLimited()) {
      this.creditScoringService.closeFlow();
      return;
    }
    return new Promise<void>((resolve, reject) => {
      this.bottomSheetService.openBottomSheet(CreditNeoWarningDialogComponent, {
        title: this.cancelInfo()?.title,
        firstDesc: this.cancelInfo()?.header,
        secondDesc: this.cancelInfo()?.description,
        secondDescColor: this.cancelInfo()?.descriptionColor,
        buttonText: this.cancelInfo()?.buttonText,
        rejectBtnTxt: this.cancelInfo()?.rejectButtonText,
      });

      const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
        bottomSheetService.unsubscribe();
        const result = this.bottomSheetService.outputData();
        if (result && result.confirmed) {
          resolve();
          this.creditScoringService.closeFlow();
        } else {
          reject(new Error('Operation failed'));
        }
      });
    });
  }

  closeFlow() {
    this.creditScoringService.closeFlow();
  }

  storeOtpData(otpCountDown: number, resendAvailable: boolean) {
    localStorage.setItem(this.OTP_COUNT_DOWN_STORAGE_KEY, '' + otpCountDown);
    localStorage.setItem(this.OTP_RESEND_AVAILABLE, resendAvailable ? 'true' : '');
  }

  getOtpData() {
    return {
      otpCountDown: +localStorage.getItem(this.OTP_COUNT_DOWN_STORAGE_KEY)!,
      resendAvailable: !!localStorage.getItem(this.OTP_RESEND_AVAILABLE),
    };
  }

  protected handleError(error: any) {
    if (error && error && error.result && error.result.status === SCORING_STATUS_CODE.OPEN_DIALOG) {
      this.openDialog(error);
      return;
    }
    this.messageService.showErrorOfErrorResponse(error);
  }

  protected openDialog(error: any) {
    const data = error;
    this.bottomSheetService.openBottomSheet(CreditNeoWarningDialogComponent, {
      title: data.title,
      firstDesc: data.firstDesc,
      secondDesc: data.secondDesc,
      pictorial: data.pictorial,
      buttonText: data.buttonText,
    });

    const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const result = this.bottomSheetService.outputData();
      if (result.terminate) {
        this.creditScoringService.closeFlow();
      } else {
        this.otpClearSignal.update((ocs) => ocs + 1);
      }
    });
  }

  protected openSupportDialog() {
    this.bottomSheetService.openBottomSheet(CreditNeoWarningDialogComponent, {
      title: 'راهنما',
      firstDesc: 'برای رفع مشکل به صفحه خانه برگردید و دوباره برای امکان‌سنجی اقدام کنید.',
      secondDesc: '',
      pictorial: false,
      buttonText: 'بازگشت به خانه',
    });

    const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      this.creditScoringService.closeFlow();
    });
  }
}
