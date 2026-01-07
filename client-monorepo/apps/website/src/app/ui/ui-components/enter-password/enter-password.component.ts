import { Component, Input } from '@angular/core';
import { EnterPasswordService } from './enter-password.service';
import { UserService } from '../../../core/services/user.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { convertNonEnglishDigits } from '@digipay/strings';
import { DeviceService } from '../../../core/services/device/device.service';
import { PinInputComponent } from '../pin-input/pin-input.component';
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-enter-password',
  templateUrl: './enter-password.component.html',
  styleUrls: ['./enter-password.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgOptimizedImage, PinInputComponent],
})
export class EnterPasswordComponent {
  @Input()
  refreshToken = false;

  pendingRequest = false;

  password = '';

  wrongPassword = false;

  invalidPasswordErrorMessage = '';

  constructor(
    private service: EnterPasswordService,
    private userService: UserService,
    private messageService: MessageService,
    private deviceService: DeviceService,
  ) {
    // this.windowKeyUp = this.windowKeyUp.bind(this);
  }

  onEnter(password) {
    this.password = password;
    this.invalidPasswordErrorMessage = '';
    if (this.password.length === 4) {
      this.login();
    }
  }

  login() {
    this.pendingRequest = true;

    this.userService
      .login({
        username: this.service.userId,
        password: convertNonEnglishDigits(this.password),
        features: this.service.features,
        device: this.deviceService.getDeviceInformation(),
      })
      .subscribe(
        (response) => {
          this.pendingRequest = false;

          if (response) {
            this.userService.setAuth(response);
            this.service.markFeaturesAsVerified();
          }

          this.service.login.next(response);
        },
        (errorResponse) => {
          this.pendingRequest = false;

          this.password = '';

          if (errorResponse.error.result.status === 2008) {
            this.wrongPassword = true;
            if (errorResponse.error.result.message) {
              this.invalidPasswordErrorMessage = errorResponse.error.result.message;
              // this.messageService.showErrorMessage(errorResponse.result.message);
            }
            of('')
              .pipe(delay(700))
              .subscribe({
                next: () => {
                  this.wrongPassword = false;
                },
              });
          }
        },
      );
  }
}
