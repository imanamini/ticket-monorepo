import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';

import { MaknaAuthenticationService } from '../../services/makna-authentication.service';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntil } from 'rxjs';
import { PasswordComplexityComponent } from '../../components/password-complexity/password-complexity.component';
import { MaknaHeaderComponent } from '../../../../shared/components/makna-header/makna-header.component';

import { PasswordInputComponent } from '../../../../shared/components/password-input/password-input.component';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { PasswordComplexityOutput } from '../../../../data-access/models/password-complexity-output.model';
import { FormErrorStatus } from '../../../../data-access/models/form-error-status.model';
import { EXPIRED_NOTICE_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from '../../../../data-access/constants/app-routes';
import { PasswordInfo } from '../../../../data-access/models/password-info.model';
import { WEALTH_TOKEN } from '../../../../components/utils/variables';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-expired-password',
  standalone: true,
  imports: [
    PasswordComplexityComponent,
    MaknaHeaderComponent,

    FormsModule,
    ReactiveFormsModule,
    PasswordInputComponent,
    UiFormFieldBuilderModule,
    NgxButtonComponent,
  ],
  templateUrl: './expired-password.component.html',
  styleUrl: './expired-password.component.scss',
})
export class ExpiredPasswordComponent extends BaseComponent implements OnInit {
  repeatPasswordInfo: PasswordComplexityOutput;
  form: FormGroup;
  showError: FormErrorStatus = 'hidden';
  errorMessage = '';
  backUrl = EXPIRED_NOTICE_ROUTE;
  password: PasswordComplexityOutput;
  passwordRepeat: PasswordComplexityOutput;
  oldPassword: PasswordComplexityOutput;
  oldPasswordWrong = false;
  loading: boolean;
  navigationService = inject(WealthNavigationService);
  queryParams: Params;
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private maknaAuthenticationService = inject(MaknaAuthenticationService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      oldPassword: '',
    });

    this.queryParams = this.activatedRoute.snapshot.queryParams;
    this.queryParams['type'] ? (this.backUrl = PROFILE_ROUTE) : (this.backUrl = EXPIRED_NOTICE_ROUTE);
  }

  passwordInfo: PasswordInfo = {
    value: '',
    isPasswordVisible: false,
    passwordStrengthText: '',
    passwordStrengthColor: '',
    complexityLevel: 0,
    isPlaceHolderVisible: true,
    placeHolder: 'رمز عبور',
    hasStrength: true,
    rules: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false,
    },
  };

  onPasswordChanged(password: PasswordComplexityOutput) {
    this.password = password;
  }

  onRepeatPasswordChanged(password: PasswordComplexityOutput) {
    this.passwordRepeat = password;
  }

  onOldPasswordValueChanged(oldPassword: PasswordComplexityOutput) {
    this.oldPassword = oldPassword;
  }

  onSubmit() {
    this.loading = true;
    /**
     * @description: Check Old password and if old password is currect, we get resetPasswordToken from server and then we send
     * new password and resetTokenPassword to server
     */
    if (this.password.value !== this.passwordRepeat.value) {
      this.messageService.showErrorMessage('رمز عبور و تکرار آن برابر نیستند');
      this.loading = false;
    } else {
      if (this.queryParams['expire']) {
        this.maknaAuthenticationService
          .changeExpiredPassword(this.oldPassword.value, this.password.value)
          .pipe(takeUntil(this.destroyObservable))
          .subscribe((res) => {
            if (res?.success) {
              this.messageService.showSuccessMessage('رمز عبور با موفقیت تغییر کرد.');
              localStorage.removeItem(WEALTH_TOKEN);
              this.navigationService.navigate([LOGIN_ROUTE]);
            } else {
              if (res && res.error && res.error.title) {
                this.messageService.showErrorMessage(res.error.title);
              }
            }

            this.loading = false;
          });
      } else {
        this.maknaAuthenticationService
          .changePassword(this.oldPassword.value, this.password.value)
          .pipe(takeUntil(this.destroyObservable))
          .subscribe((res) => {
            if (res?.success) {
              this.messageService.showSuccessMessage('رمز عبور با موفقیت تغییر کرد.');
              localStorage.removeItem(WEALTH_TOKEN);
              this.navigationService.navigate([LOGIN_ROUTE]);
            } else {
              if (res && res.error && res.error.title) {
                this.messageService.showErrorMessage(res.error.title);
              }
            }

            this.loading = false;
          });
      }
    }
  }
}
