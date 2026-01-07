import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';

import { AuthService, UserApiService } from '@client-monorepo/common/user';
import { map } from 'rxjs';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { Router } from '@angular/router';
import { FEATURE_NAMES, FEATURES } from '@client-monorepo/payment/purchase';
import { ShahkarService } from '@client-monorepo/common/shahkar';
import { PinLayoutComponent } from '@client-monorepo/common/pin';
import { StorageService } from '@client-monorepo/common/utilities';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'profile-applet-password-settings',
  standalone: true,
  imports: [
    CommonModule,
    UiFormFieldBuilderModule,
    FormsModule,
    NgxSkeletonLoadingComponent,
    PinLayoutComponent,
    NgxButtonComponent,
    DpIconComponent,
  ],
  templateUrl: './password-settings.component.html',
  styleUrl: './password-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordSettingsComponent implements OnInit {
  inPinState = signal(false);
  inDeletePasswordState = signal(false);
  onDelete = output();
  onBiometricSet = output();
  loginWithPin = signal(true);
  payWalletWithPin = signal(true);
  hasBiometric = signal(false);
  isBiometricAvailable = signal(false);
  initialized = signal(false);
  private storageService = inject(StorageService);
  isBiometricActive = input<boolean>(false);
  userServiceApi = inject(UserApiService);
  authService = inject(AuthService);
  router = inject(Router);
  shahkarService = inject(ShahkarService);
  private ngxHybridService = inject(NgxHybridService);
  constructor() {
    effect(
      () => {
        if (this.isBiometricActive()) {
          this.hasBiometric.set(true);
        }
      },
      { allowSignalWrites: true },
    );
  }
  ngOnInit(): void {
    this.getUserFeatures();
    this.checkBiometric();
  }
  getUserFeatures(): void {
    this.userServiceApi
      .getUserFeatures()
      .pipe(
        map((userFeatures) => userFeatures.features),
        map((features) => [features[FEATURES[FEATURE_NAMES.LOGIN_HOME]], features[FEATURES[FEATURE_NAMES.PAYMENT_WALLET]]]),
      )
      .subscribe({
        next: (userFeatures) => {
          this.loginWithPin.set(userFeatures[0].isProtected === 1);
          this.payWalletWithPin.set(userFeatures[1].isProtected === 1);
          this.initialized.set(true);
        },
      });
  }
  private checkBiometric(): void {
    if (this.storageService.hasBiometric()) {
      this.hasBiometric.set(true);
      this.isBiometricAvailable.set(true);
      return;
    }
    this.ngxHybridService.checkBiometricAvailability().then((available: boolean) => {
      if (available) {
        this.isBiometricAvailable.set(available);
      }
    });
  }

  deletePassword(): void {
    this.authService.deleteUserPassword().subscribe({
      next: () => {
        this.storageService.removePasswordData();
        this.ngxHybridService.removePin().then();
        this.onDelete.emit();
      },
    });
    this.inDeletePasswordState.set(false);
  }

  setUserFeature(): void {
    setTimeout(() => {
      const passToServer = {
        features: {
          [FEATURES[FEATURE_NAMES.PAYMENT_WALLET]]: { isProtected: this.payWalletWithPin() ? 1 : 0 },
          [FEATURES[FEATURE_NAMES.LOGIN_HOME]]: { isProtected: this.loginWithPin() ? 1 : 0 },
        },
      };
      this.userServiceApi.setUserFeatures(passToServer).subscribe();
    });
  }

  handleBiometric(): void {
    if (!this.hasBiometric()) {
      this.ngxHybridService.removePin().then((result: boolean) => {
        if (result) {
          this.storageService.removeHasBiometric();
          this.hasBiometric.set(false);
        }
      });
      return;
    }
    this.onBiometricSet.emit();
  }

  handleChangePin(): void {
    this.shahkarService.handleShahkarOverlay().then((result) => {
      if (result) {
        this.inPinState.set(true);
      }
    });
  }

  pinCallback() {
    this.inPinState.set(false);
  }
}
