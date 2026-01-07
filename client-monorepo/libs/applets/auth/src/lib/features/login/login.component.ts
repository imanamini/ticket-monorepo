import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { LoginState } from '../../data-access/models/login-state.enum';
import { EnterPhoneNumberComponent } from '../../components/enter-phone-number/enter-phone-number.component';
import { FillOtpComponent } from '@client-monorepo/common/otp';
import { LoginStateService } from '../../data-access/services/login-state.service';
import { AuthResponse, TacService } from '@client-monorepo/common/user';
import { StorageService } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';
import { RulesComponent } from '../../components/rules/rules.component';
import { PresentativeCodeComponent } from '../../components/presentative-code/presentative-code.component';
import { PinLayoutComponent } from '@client-monorepo/common/pin';
import { PinStatus } from '@digipay/ngx-pin';

@Component({
  selector: 'auth-applet-login',
  standalone: true,
  imports: [
    CommonModule,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    PageLayoutComponent,
    FormsModule,
    EnterPhoneNumberComponent,
    FillOtpComponent,
    RulesComponent,
    PresentativeCodeComponent,
    PinLayoutComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  phoneNumber = signal('');
  LoginState = LoginState;
  headerIcon = computed(() => {
    if (this.state() === LoginState.RULES) {
      return 'close';
    } else if (this.state() === LoginState.PHONENUMBER) {
      return '';
    } else {
      return 'arrow-right';
    }
  });
  loginStateService = inject(LoginStateService);
  state = computed(() => this.loginStateService.state());
  resetPinCallbackUrl = computed(() => {
    const redirectionUrl = this.storageService.getRedirectUrlAfterLogin();
    const routeValue = this.storageService.getBeforeLoginRoute();
    return redirectionUrl || routeValue?.url || 'auth/premium-services';
  });
  isCallTac = signal(false);
  storageService = inject(StorageService);
  router = inject(Router);
  private tacService = inject(TacService);

  goToState(state: LoginState) {
    this.loginStateService.goToState(state);
  }

  prepareStatesForOtp() {
    this.phoneNumber.set(this.loginStateService.phoneNumber() || this.storageService.getUserData()?.phoneNumber);
    this.goToState(LoginState.OTP);
  }

  otpFilled(event: any) {
    this.storageService.updateAuth(event as AuthResponse);
    if (event.hasPassword) {
      this.goToState(LoginState.PIN);
      this.isCallTac.set(true);
    } else {
      this.tacService.getTac().subscribe({
        error: (err) => {
          console.warn('Failed to fetch TAC after login:', err);
        },
      });
      this.loginStateService.redirectAfterLogin();
    }
  }

  pinCallback(status: PinStatus) {
    if (status === PinStatus.SUCCESS) {
      this.loginStateService.redirectAfterLogin();
    } else {
      this.handelHeaderAction();
    }
  }

  handelHeaderAction() {
    if (this.state() === LoginState.PHONENUMBER) {
      this.router.navigate(['/auth/onboarding']);
    } else {
      this.goToState(LoginState.PHONENUMBER);
    }
  }

  ngOnDestroy(): void {
    this.loginStateService.goToState(LoginState.PHONENUMBER);
  }
}
