import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditSmartScoringStepService } from '../services/credit-smart-scoring-step.service';
import { SMART_SCORING_STATUS_CODE } from '../services/credit-smart-scoring-step-status';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditLocationTrapComponent } from '../../components/credit-location-trap/credit-location-trap.component';
import { CreditInPageOtpComponent } from '../../components/credit-in-page-otp/credit-in-page-otp.component';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditScoringTimeLimitationComponent } from '../../wallet-activation/credit-scoring-shared/credit-scoring-time-limitation/credit-scoring-time-limitation.component';
import { CreditIcsSettingResponse } from '../../data-access/models/credit/score/credit-score-setting-response';
import { MessageService } from '../../data-access/services/message.service';
import { CreditUserService } from '../../data-access/services/credit-user.service';
import { CreditNeoWarningDialogComponent } from '../../components/credit-neo-warning-dialog/credit-neo-warning-dialog.component';
import { CreditSmartScoringStatus } from '../services/credit-smart-scoring.status';
import { CreditSmartScoringConfigResponse } from '../../data-access/models/credit-smart-scoring/credit-smart-scoring-config.response';

@Component({
  selector: 'app-credit-smart-scoring-step-otp',
  templateUrl: './credit-smart-scoring-step-otp.component.html',
  styleUrls: ['./credit-smart-scoring-step-otp.component.scss'],
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
export class CreditSmartScoringStepOtpComponent implements OnInit {
  otpDescription = 'برای مشاهده گزارش اعتبارسنجی، کد ارسال شده به شماره همراه زیر را وارد کنید.';
  warningText = {
    title: 'توجه!',
    message: 'لطفاً تا تایید کد از این صفحه خارج نشوید.',
  };
  creditScoringConfig = input<CreditSmartScoringConfigResponse>();

  verifyingCode = signal(false);
  otpClearSignal = signal(0);
  cellNumber = signal<string | null>(null);
  gettingApiCount = signal<number | null>(null);
  loading = signal(true);
  otpError = signal<string | null>(null);
  timeLimitedData = signal<CreditIcsSettingResponse | undefined>(undefined);
  timeLimited = signal(false);
  resendAvailable = signal(true);
  otpCodeLength = signal(5);
  otpCountDown = signal(120);

  next = output<void>();
  goToStep = output<CreditSmartScoringStatus>();
  close = output<void>();
  goToError = output<void>();

  private creditSmartScoringService = inject(CreditSmartScoringStepService);
  private messageService = inject(MessageService);
  private userService = inject(CreditUserService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private CreditSmartScoringStepService = inject(CreditSmartScoringStepService);
  showResend = computed(() => !!this.creditScoringConfig());

  ngOnInit() {
    this.getScoreSetting();
  }

  getScoreSetting() {
    this.CreditSmartScoringStepService.getScoringStepSetting().subscribe({
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
    this.gettingApiCount.set(3);
    this.gettingApiCount.update((count) => count! - 1);
    this.getServiceData();
    this.otpCountDown.set(this.CreditSmartScoringStepService.otpConfig()?.otpCountDown || 120);
    this.otpCodeLength.set(this.CreditSmartScoringStepService.otpConfig()?.otpLength || 5);
    this.resendAvailable.set(this.CreditSmartScoringStepService.otpConfig()?.resendAvailable || false);
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
    this.creditSmartScoringService.clearErrorType();
    this.verifyingCode.set(true);
    this.creditSmartScoringService.verifyOtp(code).subscribe({
      next: () => {
        this.verifyingCode.set(false);
        this.next.emit();
      },
      error: (error) => {
        if (error && error.result && error.result.status === SMART_SCORING_STATUS_CODE.WRONG_OTP_CODE) {
          this.verifyingCode.set(false);
          this.otpError.set(error.result.message);
          return;
        }
        if (error && error.result && error.result.status === SMART_SCORING_STATUS_CODE.SCORE_OTP_EXPIRED) {
          this.verifyingCode.set(false);
          this.otpError.set(error.result.message);
          return;
        }
        this.otpClearSignal.update((ocs) => ocs + 1);
        this.verifyingCode.set(false);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  resendCode() {
    if (!this.resendAvailable()) {
      this.showErrorPage();
      return;
    }
    return new Promise<void>((resolve, reject) => {
      this.creditSmartScoringService.resendOtp().subscribe({
        next: (response) => {
          this.otpCountDown.set(response.otpCountDown);
          this.resendAvailable.set(response.resendAvailable);
          resolve();
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
          reject(error);
        },
      });
    });
  }

  goBack() {
    if (this.timeLimited()) {
      this.close.emit();
      return;
    }
    return new Promise<void>((resolve, reject) => {
      this.bottomSheetService.openBottomSheet(CreditNeoWarningDialogComponent, {
        title: 'توقف فرآیند',
        firstDesc: 'آیا از توقف فرآیند امکان‌سنجی خود اطمینان دارید؟',
        buttonText: 'توقف فرآیند',
        rejectBtnTxt: 'ادامه فرآیند',
      });

      const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
        bottomSheetService.unsubscribe();
        const result = this.bottomSheetService.outputData();
        if (result && result.confirmed) {
          resolve();
          this.close.emit();
        } else {
          reject(new Error('Operation failed'));
        }
      });
    });
  }

  showErrorPage() {
    this.CreditSmartScoringStepService.setErrorType(SMART_SCORING_STATUS_CODE.OTP_CODE_RESEND_EXCEEDED);
    this.goToError.emit();
  }
}
