import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import {
  CreditNeoWarningDialogComponent
} from '../../../components/credit-neo-warning-dialog/credit-neo-warning-dialog.component';
import { CreditUserService } from '../../../data-access/services/credit-user.service';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditScoringSmcWithoutPayService } from '../services/credit-scoring-smc-without-pay.service';
import { CsCancelInfo } from '../../../data-access/models/credit-scoring/basic/cs-cancel-info';
import { CreditLocationTrapComponent } from '../../../components/credit-location-trap/credit-location-trap.component';
import { CreditScoringSmcApiService } from '../../../data-access/services/credit-scoring-smc-api.service';
import { CreditScoringSmcData } from '../services/credit-scoring-smc-data';
import { CREDIT_SCORING_SMC_STATUS } from '../../../data-access/models/credit/smc-score/credit-scoring-smc-status';
import { CreditInPageOtpComponent } from '../../../components/credit-in-page-otp/credit-in-page-otp.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { SCORING_STATUS_CODE } from '../../credit-scoring-step/services/credit-scoring-step-status';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import {
  CreditScoringTimeLimitationComponent
} from '../../credit-scoring-shared/credit-scoring-time-limitation/credit-scoring-time-limitation.component';
import { CreditIcsSettingResponse } from '../../../data-access/models/credit/score/credit-score-setting-response';

@Component({
  selector: 'app-credit-scoring-smc-step-otp',
  templateUrl: './credit-scoring-smc-step-otp.component.html',
  standalone: true,
  imports: [
    CreditLocationTrapComponent,
    CreditInPageOtpComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    NgxStatusResultModule,
    CreditScoringTimeLimitationComponent,
  ],
  styleUrls: ['./credit-scoring-smc-step-otp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringSmcStepOtpComponent implements OnInit {
  OTP_COUNT_DOWN_STORAGE_KEY = 'credit_cs_otp_count_down';
  OTP_RESEND_AVAILABLE = 'credit_cs_resend_available';
  otpCodeLength = 5;
  otpClearSignal = signal(0);
  trackingCode!: string | null;
  creditId = input.required<string>();
  cellNumber = signal<string | null>(null);
  verifyingCode!: boolean;
  showResend!: boolean;
  cancelInfo!: CsCancelInfo;
  otpCountDown = signal(120);
  resendAvailable = signal<boolean | null>(null);
  gettingApiCount = signal<number | null>(null);
  loading = signal(true);
  otpError = signal<string | null>(null);
  timeLimitedData = signal<CreditIcsSettingResponse | undefined>(undefined);
  timeLimited = signal(false);

  nextStep = output<CREDIT_SCORING_SMC_STATUS | 'UNREADY' | 'SHAHKAR_FAILED'>();
  reloadStatus = output<void>();

  otpDescription = 'برای مشاهده گزارش اعتبارسنجی، کد ارسال شده به شماره همراه زیر را وارد کنید.';
  warningText = {
    title: 'توجه!',
    message: 'لطفاً تا تایید کد از این صفحه خارج نشوید.',
  };

  back = output<void>();
  creditScoringService = inject(CreditScoringSmcWithoutPayService);
  messageService = inject(MessageService);
  userService = inject(CreditUserService);
  creditScoringSmcApiService = inject(CreditScoringSmcApiService);
  bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    this.getScoreSetting();
  }

  getScoreSetting() {
    this.creditScoringSmcApiService.getScoringStepSetting().subscribe({
      next: (response) => {
        this.timeLimited.set(!!response?.limitted);
        this.timeLimitedData.set(response);
        this.loading.set(false);
        if (!response?.limitted) {
          this.onStartScoring();
        }
      },
    });
  }

  onStartScoring() {
    this.gettingApiCount.set(3);
    this.sendCode(false).then(() => {
      this.gettingApiCount.update((count) => count! - 1);
    });
    this.getServiceData();
    const otpData = this.getOtpData();
    this.otpCountDown.set(otpData.otpCountDown);
    this.resendAvailable.set(otpData.resendAvailable);
    this.gettingApiCount.update((count) => count! - 1);
    this.getConfig();
  }

  getServiceData() {
    this.userService.currentUser().then((user) => {
      this.cellNumber.set(user.cellNumber);
      this.gettingApiCount.update((count) => count! - 1);
    });
  }

  sendCode(resend = true) {
    return new Promise<void>((resolve, reject) => {
      this.creditScoringSmcApiService.sendOtpSmcIcs(this.creditId(), resend).subscribe({
        next: (response) => {
          this.otpCountDown.set(response.otpCountDown);
          this.resendAvailable.set(response.resendAvailable);
          this.storeOtpData(response.otpCountDown, response.resendAvailable);
          resolve();
        },
        error: (error) => {
          if (error && error.result && error.result.status === SCORING_STATUS_CODE.SHAHKAR_FAILED) {
            this.verifyingCode = false;
            this.nextStep.emit('SHAHKAR_FAILED');
            return;
          }
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
    this.back.emit();
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
    if (error && error && error.result && error.result.status === this.creditScoringService.openDialogErrorStatus) {
      this.openDialog(error);
      return;
    }
    this.messageService.showErrorOfErrorResponse(error);
  }

  protected openDialog(error: any) {
    const data = error;
    this.bottomSheetService.openBottomSheet(
      CreditNeoWarningDialogComponent,
      {
        title: data.title,
        firstDesc: data.firstDesc,
        secondDesc: data.secondDesc,
        pictorial: data.pictorial,
        buttonText: data.buttonText,
      },
      { height: '90%' },
    );

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
    this.bottomSheetService.openBottomSheet(
      CreditNeoWarningDialogComponent,
      {
        title: 'راهنما',
        firstDesc: 'برای رفع مشکل به صفحه خانه برگردید و دوباره برای امکان‌سنجی اقدام کنید.',
        secondDesc: '',
        pictorial: false,
        buttonText: 'بازگشت به خانه',
      },
      { height: '90%' },
    );

    const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      this.creditScoringService.closeFlow();
    });
  }

  getConfig() {
    this.otpCodeLength = CreditScoringSmcData.otpLength;
    this.cancelInfo = CreditScoringSmcData.cancelInfo;
    this.showResend = true;
  }

  verifyOtp(code: any) {
    this.otpError.set(null);
    this.verifyingCode = true;
    this.creditScoringSmcApiService.verifyOtpSmcIcs(this.creditId(), code).subscribe({
      next: () => {
        this.verifyingCode = false;
        this.reloadStatus.emit();
      },
      error: (error) => {
        // handle async report: CREDIT_SCORE_ICS_SCORE_UNREADY(16514)
        if (error && error.result && error.result.status === SCORING_STATUS_CODE.SCORING_UNREADY) {
          this.verifyingCode = false;
          this.nextStep.emit('UNREADY');
          return;
        }
        if (error && error.result && error.result.status === SCORING_STATUS_CODE.WRONG_OTP_CODE) {
          this.verifyingCode = false;
          this.otpError.set(error.result.message);
          return;
        }
        this.otpClearSignal.update((ocs) => ocs + 1);
        this.verifyingCode = false;
        this.handleError(error);
      },
    });
  }
}
