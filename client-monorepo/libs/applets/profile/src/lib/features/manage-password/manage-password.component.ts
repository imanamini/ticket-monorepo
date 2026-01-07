import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';

import { PasswordSettingsComponent } from '../../components/password-settings/password-settings.component';
import { PROTECTIONS, UserApiService, UserFeature } from '@client-monorepo/common/user';
import { FillOtpComponent } from '@client-monorepo/common/otp';
import { MANAGEPASSWORDSTEPS } from '../../data-access/models/manage-password-steps.enum';
import { ActivatePasswordComponent } from '../../components/activate-password/activate-password.component';
import { map } from 'rxjs';
import { FEATURE_NAMES, FEATURES } from '@client-monorepo/payment/purchase';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { PinLayoutComponent } from '@client-monorepo/common/pin';
import { PinStatus } from '@digipay/ngx-pin';

@Component({
  selector: 'profile-applet-manage-password',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, FillOtpComponent, PasswordSettingsComponent, ActivatePasswordComponent, PinLayoutComponent],
  templateUrl: './manage-password.component.html',
  styleUrl: './manage-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagePasswordComponent implements OnInit {
  title = signal('رمز عبور');
  step = signal<number | undefined>(undefined);
  newPasswordType = signal(false);
  isBiometricActive = signal(false);

  MANAGEPASSWORDSTEPS = MANAGEPASSWORDSTEPS;
  FEATURES = FEATURES;
  FEATURE_NAMES = FEATURE_NAMES;

  userApiService = inject(UserApiService);
  backHandlerService = inject(BackHandlerService);

  ngOnInit() {
    this.getUserPasswordProtection();
  }

  getUserPasswordProtection(): void {
    this.userApiService
      .getUserFeatures()
      .pipe(
        map((userFeatures) => userFeatures.features),
        map((features) => features[FEATURES[FEATURE_NAMES.SETTINGS_PASSWORD]]),
      )
      .subscribe({
        next: (feature: UserFeature) => {
          if (feature.isProtected === PROTECTIONS.PIN) {
            this.newPasswordType.set(false);
            this.goToStep(MANAGEPASSWORDSTEPS.PIN);
          } else {
            this.goToStep(MANAGEPASSWORDSTEPS.ACTIVATION);
          }
        },
        error: () => this.goToStep(MANAGEPASSWORDSTEPS.ACTIVATION),
      });
  }

  goToStep(step: MANAGEPASSWORDSTEPS) {
    this.step.set(step);
  }

  activatePassword(): void {
    this.title.set('تنظیم رمز عبور');
    this.newPasswordType.set(true);
    this.goToStep(MANAGEPASSWORDSTEPS.OTP);
  }

  pinCallback(status: PinStatus, isSetBiometric = false) {
    if (isSetBiometric) {
      this.isBiometricActive.set(true);
    }
    if (status === PinStatus.SUCCESS) {
      this.title.set('رمز عبور');
      this.goToStep(MANAGEPASSWORDSTEPS.MANAGE);
    } else {
      this.backHandlerService.goBack();
    }
  }
}
