import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { EnterPhoneNumberComponent } from '../../components/enter-phone-number/enter-phone-number.component';
import { FillOtpComponent } from '@client-monorepo/common/otp';
import { AuthResponse, AuthService, UserZone, VerifyOtpResponse } from '@client-monorepo/common/user';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePhoneNumberComponent } from '../../components/change-phone-number/change-phone-number.component';
import { LoginState, LoginStateService } from '@client-monorepo/applets/auth';
import { map, take, tap } from 'rxjs/operators';
import { PinComponent } from '@client-monorepo/common/pin';
import { BeforeLoginRouteModel } from 'libs/shared/common/utilities/src/lib/data-access/models/before-login-route.model';
import { Title } from '@angular/platform-browser';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';
import { MessageService, StorageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'escrow-auth-applet-escrow-auth',
  standalone: true,
  imports: [
    CommonModule,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    PageLayoutComponent,
    FormsModule,
    EnterPhoneNumberComponent,
    FillOtpComponent,
    PinComponent,
    ChangePhoneNumberComponent,
    PinComponent,
  ],
  templateUrl: './escrow-auth.component.html',
  styleUrl: './escrow-auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EscrowAuthComponent implements OnInit, OnDestroy {
  loginStateService = inject(LoginStateService);
  escrowStorageService = inject(EscrowStorageService);
  storageService = inject(StorageService);
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  state = computed(() => this.loginStateService.state());
  phoneNumber = '';
  loginState = LoginState;
  beforeLoginRoute: BeforeLoginRouteModel | null = this.storageService.getBeforeLoginRoute();
  titleService = inject(Title);
  userZone = computed<UserZone>(() => {
    const zone = this.beforeLoginRoute?.queryParams['type'] === 'merchant' ? 'merchant-app' : 'app';
    this.escrowStorageService.setEscrowLastUserRole(zone ? 'seller' : 'buyer');
    this.titleService.setTitle(zone === 'merchant-app' ? 'احراز هویت' : 'ورود به دیجی‌پی');
    this.escrowStorageService.setItem('zone', zone);
    return zone;
  });

  ngOnInit() {
    this.listenToQueryParams();
  }

  goToState(state: LoginState) {
    this.loginStateService.goToState(state);
  }

  prepareStatesForOtp() {
    this.phoneNumber = this.loginStateService.phoneNumber();
    this.escrowStorageService.setEscrowCellNumber(this.phoneNumber);
    this.goToState(this.loginState.OTP);
  }

  otpFilled(event: VerifyOtpResponse | void) {
    this.storageService.updateAuth(event as AuthResponse);
    if (event && event.hasPassword) {
      this.goToState(this.loginState.PIN);
    } else {
      this.privateLogin();
    }
  }

  pinCompleted() {
    this.privateLogin();
  }

  privateLogin() {
    this.escrowStorageService.setEscrowTrustedLogin(false);
    if (!this.route.snapshot.queryParams['redirectUrl']) {
      this.loginStateService.initializeDefaultRoute(
        this.phoneNumber && this.escrowStorageService.getEscrowUUID() ? ['purchase-flow'] : ['home'],
      );
    } else {
      this.loginStateService.initializeDefaultRoute([this.route.snapshot.queryParams['redirectUrl'].split('?')[0]]);
    }
    this.loginStateService.redirectAfterLogin();
  }

  private listenToQueryParams(): void {
    this.route.queryParamMap
      .pipe(
        take(1),
        tap((params) => {
          if (params.has('cellNumber')) {
            this.loginStateService.phoneNumber.set(params.get('cellNumber') ?? '');
            this.prepareStatesForOtp();
            this.sendSms();
          }
        }),
        map((params) => params.get('uuid') || ''),
      )
      .subscribe((uuid) => {
        this.escrowStorageService.initEscrowProperties();
        this.escrowStorageService.setEscrowUUID(uuid);
      });
  }

  async sendSms(): Promise<void> {
    const sendSms$ = await this.authService.getCode(this.phoneNumber, undefined, this.userZone());
    sendSms$.subscribe({
      next: (res) => {
        this.loginStateService.phoneNumber.set(this.phoneNumber);
        this.loginStateService.userId.set(res.userId);
        this.loginStateService.isAutofill.set(res.autofill);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.loginStateService.goToState(this.loginState.PHONENUMBER);
  }
}
