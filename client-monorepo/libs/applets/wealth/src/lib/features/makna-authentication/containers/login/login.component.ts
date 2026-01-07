import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { IHint as ISecurityHint } from '../../models/security-hint.model';
import { SecurityHintsService } from '../../services/security-hints.service';
import { MaknaAuthenticationService } from '../../services/makna-authentication.service';
import { takeUntil } from 'rxjs';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxTouchKeyboardModule } from 'ngx-touch-keyboard';

import { MaknaHeaderComponent } from '../../../../shared/components/makna-header/makna-header.component';
import { PasswordInputComponent } from '../../../../shared/components/password-input/password-input.component';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { PasswordInfo } from '../../../../data-access/models/password-info.model';
import { FormErrorStatus } from '../../../../data-access/models/form-error-status.model';
import { ProfileService } from '../../../../components/core/services/profile.service';
import { environment } from '../../../../data-access/environments/environment';
import { checkWealthOrigin } from '../../../../components/utils/check-wealth-origin';
import {
  EXPIRED_SESSION_NOTICE_ROUTE,
  FORGET_PASSWORD_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { ErrorCodes } from '../../../../data-access/enums/error-codes';
import { validateNationalId } from '../../../../components/utils/strings';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { Router } from '@angular/router';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    NgxButtonComponent,
    MaknaHeaderComponent,
    UiFormFieldBuilderModule,
    PasswordInputComponent,
    NgxTouchKeyboardModule,
    NgxCountDownComponent,
    NgClass,
  ],
})
export class LoginComponent extends BaseComponent implements OnInit {
  password = '';
  expanedClass = false;
  securityHints: ISecurityHint[];
  loading = false;
  timeIsOver = true;
  rateLimit: boolean;
  otpSecounds = 120;
  passwordInfo: PasswordInfo = {
    value: '',
    isPasswordVisible: false,
    passwordStrengthText: '',
    passwordStrengthColor: '',
    complexityLevel: 0,
    isPlaceHolderVisible: true,
    placeHolder: 'رمز عبور',
    hasStrength: false,
    rules: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false,
    },
  };

  form: FormGroup;
  errorMessage = '';
  showError: FormErrorStatus = 'hidden';
  showRegister = true;

  site = 'https://wealth.mydigipay.ir';
  navigationService = inject(WealthNavigationService);
  router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private securityHintsService = inject(SecurityHintsService);
  private maknaAuthenticationService = inject(MaknaAuthenticationService);
  private messageService = inject(MessageService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.site = environment.isWealthDomain ? 'https://wealth.mydigipay.ir' : 'https://app.mydigipay.com';

    this.securityHintsService
      .getAll()
      .pipe(takeUntil(this.destroyObservable))
      .subscribe((res) => {
        this.securityHints = res;
      });

    this.form = this.formBuilder.group({
      nationalId: ['', [Validators.required, this.nationalIdValidator, Validators.minLength(10)]],
    });
    this.showRegister = checkWealthOrigin() === 'wealth';
  }

  onBackButtonClicked() {
    window.open(window.location.origin, '_self');
  }

  timerFinish() {
    this.timeIsOver = true;
    this.rateLimit = false;
  }

  onbuttonClick(type: string) {
    switch (type) {
      case 'FORGET_PASSWORD':
        this.navigationService.navigate([FORGET_PASSWORD_ROUTE]);
        break;
      case 'GO_TO_LOGIN':
        this.navigationService.navigate([REGISTER_ROUTE]);
        break;
      case 'LOGIN':
        this.login();
        break;
    }
  }

  private login() {
    this.loading = true;

    try {
      const stamp = btoa(`${this.form.controls['nationalId'].value}:${this.password}`);
      this.maknaAuthenticationService
        .login(stamp)
        .pipe(takeUntil(this.destroyObservable))
        .subscribe((res) => {
          if (res?.success) {
            const redirectUrl = localStorage.getItem('redirectUrl');
            this.profileService.clearProfileData();
            localStorage.removeItem('redirectUrl');
            if (redirectUrl && !redirectUrl.includes(LOGIN_ROUTE) && !redirectUrl.includes(EXPIRED_SESSION_NOTICE_ROUTE)) {
              if (redirectUrl.indexOf('?') === -1) {
                this.router.navigate([redirectUrl]);
              } else {
                const url = new URL(redirectUrl, window.location.origin);
                const queryParams: { [key: string]: string } = {};
                url.searchParams.forEach((value, key) => {
                  queryParams[key] = value;
                });
                this.router.navigate([url.pathname], {
                  queryParams,
                });
              }
            } else {
              this.navigationService.navigate([HOME_ROUTE]);
            }
          } else {
            if (res?.error?.code == ErrorCodes.RateLimited || res?.error?.code == ErrorCodes.UserIsLockedOut) {
              this.timerFinish();
              this.rateLimit = true;
              this.otpSecounds = 300;
              this.timeIsOver = false;
            }
            this.messageService.showErrorMessage(this.generateMessage(res.error?.title || res?.error?.error?.title));
          }
          this.loading = false;
        });
    } catch (error) {
      this.messageService.showErrorMessage('لطفا از کیبورد انگلیسی استفاده کنید.');
      this.loading = false;
    }
  }

  onPasswordChange(event: any) {
    this.password = event.value;
  }

  private generateMessage(message: string): string {
    const regex = /09\d*\*{5}\d{2}/;
    if (regex.test(message)) {
      message = message.replace(regex, (match) => {
        const splitedNumber = match.split('*****');
        const formatedNumber = splitedNumber[1] + '*****' + splitedNumber[0];
        return formatedNumber;
      });
    }

    return message;
  }

  checkNationalID() {
    if (this.form.controls['nationalId']?.value?.length > 9) {
      const val: any = this.nationalIdValidator(this.form.controls['nationalId']);
      if (val?.invalidNotionalCode) {
        this.showError = 'show';
        this.errorMessage = 'کدملی وارد شده معتبر نیست.';
      }
    } else {
      this.showError = 'hidden';
    }
  }

  nationalIdValidator(control: AbstractControl): { [s: string]: boolean } {
    if (validateNationalId(control.value)) {
      return null;
    }
    return { invalidNotionalCode: true };
  }
}
