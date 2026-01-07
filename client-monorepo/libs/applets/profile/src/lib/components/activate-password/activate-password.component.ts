import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService, VerificationService } from '@client-monorepo/common/user';
import { LoginStateService } from '@client-monorepo/applets/auth';
import { DeviceInfoService, MessageService } from '@client-monorepo/common/utilities';
import { ShahkarService } from '@client-monorepo/common/shahkar';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'profile-applet-activate-password',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './activate-password.component.html',
  styleUrl: './activate-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivatePasswordComponent {
  phoneNumber = signal('');
  returnedOk = output();
  authService = inject(AuthService);
  loginStateService = inject(LoginStateService);
  messageService = inject(MessageService);
  deviceInfo = inject(DeviceInfoService);
  verificationService = inject(VerificationService);
  shahkarService = inject(ShahkarService);

  getCode(): void {
    this.deviceInfo.getDeviceInfo().then((deviceInfo) => {
      this.verificationService.sendOtp(deviceInfo).subscribe({
        next: (res) => {
          this.loginStateService.userId.set(res?.userId);
          this.returnedOk.emit();
        },
        error: (err) => {
          this.messageService.showErrorOfErrorResponse(err);
        },
      });
    });
  }

  handleActivation(): void {
    this.shahkarService.handleShahkarOverlay().then((result) => {
      if (result) {
        this.getCode();
      }
    });
  }
}
