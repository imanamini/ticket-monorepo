import { Component, inject, signal, ViewChild } from '@angular/core';
import { convertNonEnglishDigits } from '@digipay/strings';
import { EnterPasswordService } from './enter-password.service';
import { catchError, takeUntil, throwError } from 'rxjs';
import { BaseComponent } from '../../../components/core/components/base/base.component';
import { AuthService } from '../../../components/core/services/auth.service';
import { DeviceInfoService } from '../../../components/core/services/device-info.service';
import { AuthenticationStorageService } from '../../../components/core/services/authentication-storage.service';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { EnterPasswordEnum, NgxPin } from '@digipay/ngx-pin';

@Component({
  selector: 'app-enter-password',
  templateUrl: './enter-password.component.html',
  styleUrls: ['./enter-password.component.scss'],
  standalone: true,
  imports: [NgxSpinnerModule, NgxPin],
})
export class EnterPasswordComponent extends BaseComponent {
  pendingRequest = false;
  enterPasswordState = signal(EnterPasswordEnum.ENTER);
  hint = signal('');
  @ViewChild('pinComponent') pinComponent!: NgxPin;

  password = '';

  icon: 'lock' | 'unlock' = 'lock';
  hasError = false;
  private authService = inject(AuthService);
  private deviceInfoService = inject(DeviceInfoService);
  private enterPasswordService = inject(EnterPasswordService);
  private authenticationStorageService = inject(AuthenticationStorageService);

  constructor() {
    super();
  }

  onEnter($event: any) {
    this.password = $event;
    if ($event.length === 4) {
      this.pinEnter();
    }
  }

  pinEnter() {
    this.hasError = false;
    this.pendingRequest = true;
    this.deviceInfoService.getDeviceInfo().then((deviceInfo) => {
      if (deviceInfo.deviceId) {
        this.authService
          .login({
            username: this.authenticationStorageService.getUserId(),
            password: convertNonEnglishDigits(this.password),
            features: this.enterPasswordService.features,
            device: deviceInfo,
          })
          .pipe(
            catchError((err) => {
              // this.hasError = true;
              // this.messageService.showErrorMessage('رمز عبور اشتباه است');
              this.enterPasswordState.set(EnterPasswordEnum.WRONG);
              this.hint.set('رمز عبور اشتباه است!');
              setTimeout(() => {
                this.resetPin();
              }, 1500);

              this.pendingRequest = false;
              return throwError(() => err);
            }),
            takeUntil(this.destroyObservable),
          )
          .subscribe((response) => {
            if (response.accessToken) {
              if (response) {
                this.authenticationStorageService.updateAuth(response);
                this.enterPasswordService.markFeaturesAsVerified();
              }
              if (response.result.status === 200) {
                this.icon = 'unlock';
              }
              this.enterPasswordService.login.next(response);
            }
            this.pendingRequest = false;
          });
      }
    });
  }

  private resetPin(): void {
    if (this.pinComponent) {
      this.enterPasswordState.set(EnterPasswordEnum.ENTER);
      this.hint.set('');
      this.pinComponent.resetPin();
    }
  }
}
