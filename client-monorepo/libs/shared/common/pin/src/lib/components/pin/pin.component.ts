import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeviceInfo, DeviceInfoService, MessageService, StorageService } from '@client-monorepo/common/utilities';
import { OverlayManagerService } from '@client-monorepo/common/ui-components';
import { ShahkarService } from '@client-monorepo/common/shahkar';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { AuthResponse, AuthService, TacService } from '@client-monorepo/common/user';
import { UserBlockErrorComponent } from '../user-block-error/user-block-error.component';
import { generateRateLimitMessage } from '../../data-access/utils/rate-limit-message-generator';
import { PinConfigInterface } from '../../data-access/models/pin-config.interface';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EnterPasswordEnum, NgxPin, PinComponentStateEnum, PinStatus } from '@digipay/ngx-pin';

@Component({
  selector: 'common-pin-user-pin',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPin],
  templateUrl: './pin.component.html',
  styleUrl: './pin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinComponent implements OnInit {
  pinConfig = input<PinConfigInterface>({} as PinConfigInterface);
  newPasswordType = computed(() => this.pinConfig().newPasswordType ?? false);
  type = computed(() => this.pinConfig().type ?? false); // if false pin opened in bottom sheet
  forgotPassword = computed(() => this.pinConfig().forgotPassword ?? false);
  phoneNumber = computed(() => this.pinConfig().phoneNumber ?? '');
  features = computed(() => this.pinConfig().features ?? []);
  requestHeaders = computed(() => this.pinConfig().requestHeaders ?? undefined);
  hasBackground = computed(() => this.pinConfig().hasBackground ?? true);
  payType = computed(() => this.pinConfig().isPayType ?? false);
  enteredPassword = signal('');
  confirmPassword = signal('');
  state = signal(PinComponentStateEnum.OLD);
  enterPasswordState = signal(EnterPasswordEnum.ENTER);
  showBiometric = input<boolean>(true);
  title = computed(() => {
    switch (this.state()) {
      case PinComponentStateEnum.OLD:
        return 'رمز عبور خود را وارد کنید.';
      case PinComponentStateEnum.NEW:
        return 'رمز عبور جدید خود را وارد کنید.';
      case PinComponentStateEnum.CONFIRM:
        return 'رمز عبور جدید خود را مجددا وارد کنید.';
      case PinComponentStateEnum.PAY:
        return 'برای تایید پرداخت رمز خود را وارد کنید.';
    }
  });
  hint = signal('');

  pin = signal(['', '', '', '']);
  textPin = signal('');
  activeStep = signal(0);
  hasBiometric = signal(false);
  device!: DeviceInfo;

  callbackFunction = output<PinStatus>();
  pinOutput = output<string>();
  authService = inject(AuthService);
  deviceInfoService = inject(DeviceInfoService);
  storageService = inject(StorageService);
  bottomSheetService = inject(NgxBottomSheetService);
  shahkarService = inject(ShahkarService);
  overlayManagerService = inject(OverlayManagerService);
  messageService = inject(MessageService);
  private tacService = inject(TacService);
  private ngxHybridService = inject(NgxHybridService);
  private untilDestroy = inject(DestroyRef);
  submitting = signal(false);
  @ViewChild('pinComponent') pinComponent!: NgxPin;
  ngOnInit() {
    if (this.newPasswordType()) {
      this.state.set(PinComponentStateEnum.NEW);
      this.hint.set('ارقام تکرارشونده و یا متوالی وارد نکنید.');
    }
    if (this.payType()) {
      this.state.set(PinComponentStateEnum.PAY);
    }
    this.checkHasBiometric();
  }
  private checkHasBiometric(): void {
    if (this.storageService.hasBiometric() && this.showBiometric()) {
      this.hasBiometric.set(true);
    }
  }
  pinComplete(pin: string): void {
    this.textPin.set(pin);
    switch (this.state()) {
      case PinComponentStateEnum.PAY:
      case PinComponentStateEnum.OLD:
        this.enteredPassword.set(this.textPin());
        this.checkPin().then();
        break;
      case PinComponentStateEnum.NEW:
        if (this.isInvalidPattern(this.textPin())) {
          const errorMessage = 'رمز عبور انتخابی ساده و قابل حدس است. لطفاً رمزی امن‌تر وارد کنید.';
          this.messageService.showErrorMessage(errorMessage);
          this.resetPin();
          return;
        }
        this.hint.set('');
        this.enteredPassword.set(this.textPin());
        this.state.set(PinComponentStateEnum.CONFIRM);
        this.resetPin();
        break;
      case PinComponentStateEnum.CONFIRM:
        this.confirmPassword.set(this.textPin());
        this.checkPasswordEquality();
        break;
    }
  }
  private isInvalidPattern(input: string): boolean {
    const firstDigit = input[0];
    let allSame = true;
    let isAscending = true;
    let isDescending = true;

    for (let i = 1; i < input.length; i++) {
      const curr = input[i];
      const prev = input[i - 1];

      if (curr !== firstDigit) allSame = false;

      const diff = curr.charCodeAt(0) - prev.charCodeAt(0);

      if (diff !== 1) isAscending = false;

      if (diff !== -1) isDescending = false;

      if (!allSame && !isAscending && !isDescending) return false;
    }
    return allSame || isAscending || isDescending;
  }
  async checkPin(): Promise<void> {
    this.submitting.set(true);
    const device = await this.deviceInfoService.getDeviceInfo();
    this.authService
      .login(
        {
          username: this.storageService.getUserId(),
          password: this.textPin(),
          features: this.features(),
          device: device,
        },
        this.requestHeaders(),
      )
      .subscribe({
        next: (res: AuthResponse) => {
          this.storageService.updateAuth(res);
          if (this.pinConfig().isCallTac) {
            this.tacService.getTac().subscribe();
          }
          if (!this.storageService.isSetPassword()) {
            this.storageService.setPassword();
          }
          if (this.pinConfig().isBiometricType) {
            this.setBiometric();
            return;
          }
          this.shahkarService.handleShahkarOverlay({ cancelable: true }).then((result) => {
            if (result) {
              this.successEnterPin();
            } else {
              this.resetPin();
            }
          });
          this.submitting.set(false);
        },
        error: (error) => {
          if (!this.storageService.getUserId()) {
            this.authService.performLocalLogout();
            return;
          }
          const { attemptsResetTime, remainingAttempts } = error.error;
          if (error?.error?.result?.status === 1130) {
            this.handleBlockedStatus(attemptsResetTime);
          } else {
            this.handleCheckPinErrors(remainingAttempts, attemptsResetTime);
          }
          this.handleIncorrectPassword();
          this.submitting.set(false);
        },
      });
  }
  setBiometric(): void {
    this.ngxHybridService
      .authenticateBiometric()
      .pipe(takeUntilDestroyed(this.untilDestroy))
      .subscribe({
        next: (result) => {
          if (result) {
            this.ngxHybridService.setPin(this.textPin()).then((result: boolean) => {
              if (result) {
                this.handleCallbackFunction(PinStatus.SUCCESS);
                this.storageService.setHasBiometric();
              }
            });
          }
        },
        error: () => {
          this.handleCallbackFunction(PinStatus.FAILED);
        },
      });
  }
  handleIncorrectPassword(): void {
    const errorTimeCount = this.hasBackground() ? 1500 : 1000;
    this.enterPasswordState.set(EnterPasswordEnum.WRONG);
    this.hint.set('رمز عبور اشتباه است!');
    setTimeout(() => {
      this.enterPasswordState.set(EnterPasswordEnum.ENTER);
      this.hint.set('');
      this.resetPin();
    }, errorTimeCount);
  }
  handleBlockedStatus(attemptsResetTime: number) {
    this.overlayManagerService.displayOverlay(UserBlockErrorComponent, { attemptsResetTime }, { type: 'error' }).then(() => {
      this.handleCallbackFunction(PinStatus.BLOCKED);
    });
  }

  handleCheckPinErrors(remainingAttempts: number, attemptsResetTime: number) {
    const errorMessage = generateRateLimitMessage(remainingAttempts, attemptsResetTime);
    if (remainingAttempts < 2) {
      this.messageService.showErrorMessage(errorMessage);
    } else if (remainingAttempts < 4) {
      this.messageService.showWarningMessage(errorMessage);
    }
  }

  successEnterPin(): void {
    if (!this.hasBackground()) {
      this.handleCallbackFunction(PinStatus.SUCCESS);
      return;
    }
    this.enterPasswordState.set(EnterPasswordEnum.CORRECT);
    setTimeout(() => {
      this.handleCallbackFunction(PinStatus.SUCCESS);
    }, 1400);
  }

  checkPasswordEquality(): void {
    if (this.confirmPassword() !== this.enteredPassword()) {
      this.hint.set('رمزهای ورودی مطابقت ندارند.مجددا تلاش کنید.');
      this.state.set(PinComponentStateEnum.NEW);
      this.resetPin();
    } else if (this.forgotPassword()) {
      this.pinOutput.emit(this.confirmPassword());
    } else {
      this.authService.setUserPassword(this.textPin()).subscribe({
        next: () => {
          this.resetBiometricAfterPinChange(this.textPin());
          this.successEnterPin();
        },
        error: () => {
          this.messageService.showErrorMessage('مشکلی بوجود آمده است! .مجددا تلاش کنید.');
          this.state.set(PinComponentStateEnum.NEW);
          this.resetPin();
        },
      });
    }
  }
  private resetPin(): void {
    if (this.pinComponent) {
      this.pinComponent.resetPin();
    }
  }
  handleCallbackFunction(status: PinStatus): void {
    if (this.type()) {
      this.callbackFunction.emit(status);
    } else {
      this.bottomSheetService.outputData.set({ res: status });
      this.bottomSheetService.closeBottomSheet();
    }
  }

  resetBiometricAfterPinChange(pin: string): void {
    if (this.storageService.hasBiometric()) {
      this.ngxHybridService.checkBiometricAvailability().then((result) => {
        if (result) {
          this.ngxHybridService.setPin(pin).then();
        }
      });
    }
  }
}
