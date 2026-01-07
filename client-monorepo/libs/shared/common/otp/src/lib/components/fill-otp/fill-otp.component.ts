import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, model, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DeviceInfoService, rangeCreator, StorageService, numberMatcher } from '@client-monorepo/common/utilities';
import { AuthService, UserZone, VerificationService, VerifyOtpRequest, VerifyOtpResponse } from '@client-monorepo/common/user';
import { LoginState, LoginStateService } from '@client-monorepo/applets/auth';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { convertNonEnglishDigits } from '@digipay/strings';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { OtpModeEnum } from '../../data-access/models/otp-mode.enum';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-otp-fill-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, DpIconComponent, NgxButtonComponent],
  templateUrl: './fill-otp.component.html',
  styleUrl: './fill-otp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FillOtpComponent implements OnInit {
  mode = input<'verification' | 'login' | 'fine' | 'forgot-password'>('login');
  featureForVerification = input<number[]>([]);
  retryOutput = output<boolean>();
  phoneNumber = input<string>('');
  otpLength = input<number>(6);
  autoVerify = input<boolean>(true);
  editButton = input<boolean>(true);
  isTwiceButton = input<boolean>(true);
  isSubmitButton = input<boolean>(false);
  zone = input<UserZone | undefined>(undefined);
  externalErrorMessage = model<string>('');

  timer = signal('1:59');
  hint = signal('');
  private isOtpSubmitted = signal(false);
  timerInterval: any;
  otp: string[] = [];
  isTimerFinished = false;
  ctrlDown = false;
  isAutoFill = signal(false);
  isLoading = signal(false);
  rangeCreator = rangeCreator;
  title = computed(() => {
    switch (this.mode()) {
      case OtpModeEnum.FORGOT_PASSWORD:
        return 'کد احراز هویت را برای بازیابی رمز وارد کنید.';
      default:
        if (this.isAutoFill()) {
          return 'به دلایل امنیتی، حتما باید از قابلیت پر شدن خودکار استفاده نمایید.';
        } else {
          return 'کد فعالسازی ارسال شده را وارد کنید.';
        }
    }
  });

  okReturned = output<VerifyOtpResponse | void>();
  fillOtp = output<string>();
  authService = inject(AuthService);
  loginStateService = inject(LoginStateService);
  verificationService = inject(VerificationService);
  ngxHybridService = inject(NgxHybridServiceService);
  private eventService = inject(NgxEventTrackerService);
  private deviceInfoService = inject(DeviceInfoService);
  private storageService = inject(StorageService);
  private ngxEventTrackerService = inject(NgxEventTrackerService);
  private destroyRef = inject(DestroyRef);
  private isDestroyed = false;

  constructor() {
    this.deviceInfoService.getDeviceInfo().then();
    this.checkIsAutofillMode();
    effect(() => {
      if (this.externalErrorMessage()) {
        setTimeout(() => {
          this.resetState();
          this.isOtpSubmitted.set(false);
        }, 5 * 1000);
      }
    });

    // Track when component is being destroyed
    this.destroyRef.onDestroy(() => {
      this.isDestroyed = true;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
    });
  }

  ngOnInit(): void {
    this.checkRetry();
    this.focusOnElementWithId('otp-0');
    this.setTimer();
    this.otp = [];
    for (let i = 0; i < this.otpLength(); i++) {
      this.otp.push('');
    }
  }
  private checkRetry(): void {
    if (this.loginStateService.isRetry()) {
      const retryText = 'کدی که پیش تر برای شما ارسال شده همچنان معتبر است.';
      this.hint.set(retryText);
    }
  }
  private checkIsAutofillMode(): void {
    const isAutoFillFromResponse = this.loginStateService.isAutofill();
    // Default autofill in hybrid mode.
    if (this.ngxHybridService.isAndroidHybrid() && !isAutoFillFromResponse) {
      this.autoFillPin();
      return;
    }
    this.deviceInfoService.getDeviceInfo().then((deviceInfo) => {
      if (this.ngxHybridService.isAndroidHybrid() && isAutoFillFromResponse && (deviceInfo.isAutoFillSupported ?? true)) {
        this.isAutoFill.set(true);
        this.autoFillPin();
      }
    });
  }

  private autoFillPin(): void {
    // Backward logic: When otp length is  less than 6 digits this function should be returned.
    this.ngxHybridService.setOtpCode().then((otp: string) => {
      if (!Number(otp.length === 6)) {
        return;
      }
      for (let i = 0; i < otp.length; i++) {
        this.otp[i] = otp[i];
      }
      this.checkOrResendOTP();
    });
  }

  setTimer(initialAgain = false): void {
    if (initialAgain) {
      this.isTimerFinished = false;
      this.timer.set('1:59');
    }
    this.timerInterval = setInterval(() => {
      this.timer.update((time) => {
        const [minute, second] = time.split(':');
        let secondInt = parseInt(second);
        let minuteInt = parseInt(minute);
        secondInt--;
        if (secondInt < 1) {
          if (minuteInt > 0) {
            secondInt = 59;
          } else {
            secondInt = 0;
          }
          minuteInt = 0;
        }
        time = minuteInt + ':' + secondInt.toString().padStart(2, '0');
        if (minuteInt === 0 && secondInt === 0) {
          clearInterval(this.timerInterval);
          this.isTimerFinished = true;
        }
        return time;
      });
    }, 1000);
  }

  focusOnElementWithId(id: string): void {
    const elem = document.getElementById(id);
    if (elem) {
      elem.focus();
    }
  }

  resetState(): void {
    this.hint.set('');
    this.externalErrorMessage.set('');
    this.otp = Array(Number(this.otpLength())).fill('');
    this.focusOnElementWithId('otp-0');
  }

  otpChange(event: KeyboardEvent, index: number) {
    if (this.checkMetaKey(event, index)) {
      return;
    }
    const eventKey = convertNonEnglishDigits(event.key);
    setTimeout(() => {
      this.otp[index] = eventKey;
      const element = document.getElementById('otp-' + (index + 1));
      if (index === this.otpLength() - 1) {
        this.checkOrResendOTP();
      }
      element?.focus();
    }, 50);
  }

  async sendOtpAgain(): Promise<void> {
    if (!this.isTimerFinished || this.isDestroyed) {
      return;
    }
    if (this.mode() === 'fine') {
      this.retryOutput.emit(true);
      this.setTimer(true);
      return;
    }
    const sendSms$ = await this.authService.getCode(this.phoneNumber());
    sendSms$.subscribe();
    this.setTimer(true);
  }

  checkOrResendOTP(): void {
    if (this.isOtpSubmitted() || this.isDestroyed) return;
    this.isOtpSubmitted.set(true);

    const code = this.otp.join('');
    if (!this.isDestroyed) {
      this.fillOtp.emit(code);
    }

    if (!this.autoVerify()) return;
    if (this.mode() === 'login') {
      this.continueLoginFlow(code);
    } else {
      this.continueVerificationFlow(code);
    }
  }

  private sendGtmUserIdEvent(): void {
    const eventData = {
      event: 'set_user_id',
      user_id: this.loginStateService.userId() || this.storageService.getUserId(),
    };
    this.ngxEventTrackerService.sendEvent(eventData, { platforms: ['gtm'] });
  }

  private sendGtmLoginEvent(): void {
    const eventData = {
      event: 'login',
      user_id: this.loginStateService.userId() || this.storageService.getUserId(),
    };
    this.ngxEventTrackerService.sendEvent(eventData, { platforms: ['gtm'] });
  }

  continueLoginFlow(code: string): void {
    if (this.isDestroyed) return;
    this.isLoading.set(true);
    const passToServer: VerifyOtpRequest = {
      smsToken: code,
      userId: this.loginStateService.userId() || this.storageService.getUserId(),
    };

    this.authService.verifyOtp(passToServer, this.zone()).subscribe({
      next: (res) => {
        if (this.isDestroyed) return;
        this.isLoading.set(false);
        this.isOtpSubmitted.set(false);
        this.eventService.loginIntrack(this.loginStateService.userId() || this.storageService.getUserId());
        this.sendGtmUserIdEvent();
        this.sendGtmLoginEvent();
        if (this.ngxHybridService.isHybrid()) {
          this.ngxHybridService.userLoginEvent(this.loginStateService.userId() || this.storageService.getUserId());
        }
        if (!this.isDestroyed) {
          this.okReturned.emit(res);
        }
      },
      error: (err) => {
        if (this.isDestroyed) return;
        this.isLoading.set(false);
        this.isOtpSubmitted.set(false);
        this.hint.set(err?.error?.result?.message);
        setTimeout(() => {
          if (!this.isDestroyed) {
            this.resetState();
          }
        }, 1000);
      },
    });
  }

  continueVerificationFlow(code: string): void {
    if (this.isDestroyed) return;
    this.isLoading.set(true);
    this.verificationService
      .verifyOtp(code, this.featureForVerification())
      .then(() => {
        if (this.isDestroyed) return;
        this.isLoading.set(false);
        this.isOtpSubmitted.set(false);
        if (!this.isDestroyed) {
          this.okReturned.emit();
        }
      })
      .catch((err) => {
        if (this.isDestroyed) return;
        this.isLoading.set(false);
        this.isOtpSubmitted.set(false);
        this.hint.set(err?.error?.result?.message);
        setTimeout(() => {
          if (!this.isDestroyed) {
            this.resetState();
          }
        }, 1000);
      });
  }

  async handlePaste() {
    const pasteData = await navigator.clipboard.readText();

    if (!pasteData || isNaN(+pasteData)) {
      return;
    }

    for (let i = 0; i < pasteData.length; i++) {
      this.otp[i] = pasteData[i];
    }
    this.checkOrResendOTP();
  }

  pasteFromClipboard() {
    if (this.otp[0].length === this.otpLength()) {
      const clipboardText = this.otp[0];
      for (let i = 0; i < clipboardText.length; i++) {
        this.otp[i] = clipboardText[i];
      }
      this.focusOnElementWithId('otp-' + this.otpLength());
      this.checkOrResendOTP();
    }
  }

  checkMetaKey(event: KeyboardEvent, index: number): boolean {
    if (event.key === 'Control') {
      this.ctrlDown = true;
      return true;
    }
    if (event.key === 'v') {
      if (this.ctrlDown) {
        this.handlePaste();
        return true;
      }
    }
    if (!numberMatcher(event)) {
      event.preventDefault();
      return true;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.otp[index] = '';
      const element = document.getElementById('otp-' + (index - 1));
      element?.focus();
      return true;
    }
    return false;
  }

  goBackToPhoneNumberState(): void {
    this.loginStateService.goToState(LoginState.PHONENUMBER);
  }

  removeControlKeyPressed(): void {
    this.ctrlDown = false;
  }
}
