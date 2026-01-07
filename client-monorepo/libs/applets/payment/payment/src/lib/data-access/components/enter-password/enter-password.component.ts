import { Component, signal, viewChild } from '@angular/core';
import { EnterPasswordService } from '../../services/enter-password.service';
import { DeviceInfoService, StorageService } from '@client-monorepo/common/utilities';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@client-monorepo/common/user';
import { EnterPasswordEnum, NgxPin } from '@digipay/ngx-pin';

@Component({
  selector: 'payment-applet-enter-password',
  standalone: true,
  imports: [CommonModule, DpIconComponent, ReactiveFormsModule, FormsModule, NgxPin],
  templateUrl: './enter-password.component.html',
  styleUrls: ['./enter-password.component.scss'],
})
export class EnterPasswordComponent {
  // Signals
  pin = signal('');
  hint = signal('');
  loading = signal(false);
  enterPasswordState = signal(EnterPasswordEnum.ENTER);

  pinComponent = viewChild<NgxPin>('pinComponent');

  constructor(
    private enterPasswordService: EnterPasswordService,
    private deviceInfoService: DeviceInfoService,
    private authService: AuthService,
    private storageService: StorageService,
  ) {}

  pinCompletedHandler(pin: string) {
    this.pin.set(pin);
    this.checkPin();
  }

  focusOnElementWithId(): void {
    this.pinComponent()?.isFocus.set(true);
  }

  resetPin() {
    this.hint.set('');
    this.enterPasswordState.set(EnterPasswordEnum.ENTER);
    this.pin.set('');
    this.pinComponent()?.resetPin();
  }

  checkPin() {
    this.loading.set(true);
    this.deviceInfoService.getDeviceInfo().then((device) => {
      this.authService
        .login({
          username: this.storageService.getUserId(),
          password: this.pin(),
          features: this.enterPasswordService.features,
          device,
        })
        .subscribe({
          next: (res) => {
            this.loading.set(false);
            this.enterPasswordState.set(EnterPasswordEnum.CORRECT);
            this.storageService.updateAuth(res);
            this.enterPasswordService.markFeaturesAsVerified();
            this.enterPasswordService.login.next(res);
          },
          error: () => {
            this.loading.set(false);
            this.enterPasswordState.set(EnterPasswordEnum.WRONG);
            this.hint.set('رمز عبور اشتباه است');

            setTimeout(() => {
              this.resetPin();
            }, 1500);
          },
        });
    });
  }
}
