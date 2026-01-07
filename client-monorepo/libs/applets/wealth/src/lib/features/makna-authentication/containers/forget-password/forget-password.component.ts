import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { PasswordComplexityComponent } from '../../components/password-complexity/password-complexity.component';
import { ERegisterSteps } from '../../models/register-steps.enum';
import { NationalIdComponent } from '../../components/national-id/national-id.component';
import { FormOutputModel } from '../../components/national-id/model/form-output.model';
import { MaknaAuthenticationService } from '../../services/makna-authentication.service';
import { takeUntil } from 'rxjs';
import { NgxButtonComponent } from '@digipay/ngx-button';

import { MaknaHeaderComponent } from '../../../../shared/components/makna-header/makna-header.component';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { ResponseError } from '../../../../data-access/models/response-error.model';
import { PasswordComplexityOutput } from '../../../../data-access/models/password-complexity-output.model';
import { ErrorCodes } from '../../../../data-access/enums/error-codes';
import { LOGIN_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { MessageService } from '@client-monorepo/common/utilities';
import { PinInputComponent } from '../../../../shared/components/pin-input/pin-input.component';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaknaHeaderComponent,
    UiFormFieldBuilderModule,
    PasswordComplexityComponent,
    NationalIdComponent,
    NgxButtonComponent,
    NgxCountDownComponent,
    PinInputComponent,
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent extends BaseComponent {
  activeStep: number = ERegisterSteps.InsertNationalID;
  _activeStep = ERegisterSteps;
  inOTPStep = false;
  otpErrorInfo: ResponseError | null = null;
  timeIsOver = false;
  otpSecounds = 120;
  otpHasError = false;
  otpCode = '';
  phoneNumber: string;
  resetToken: string;
  password: PasswordComplexityOutput;
  passwordRepeat: PasswordComplexityOutput;

  nationalIdInfo: FormOutputModel = new FormOutputModel();
  rateLimit: boolean;
  loading = false;
  navigationService = inject(WealthNavigationService);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  private maknaAuthenticationService = inject(MaknaAuthenticationService);

  constructor() {
    super();
  }

  timerFinish() {
    this.timeIsOver = true;
    this.rateLimit = false;
  }

  reInitializeTimer(sec) {
    this.timeIsOver = true;
    setTimeout(() => {
      this.timeIsOver = false;
      this.otpSecounds = sec;
      this.cdr.detectChanges();
    }, 0);
  }

  pinChanged(val: string) {
    this.otpHasError = false;
    this.otpCode = val;
  }

  onNextStep(step: string) {
    switch (step) {
      case 'GET_OTP':
        this.otpSecounds = 120;
        this.getOtp();
        break;
      case 'CHECK_OTP':
        this.loading = true;

        this.maknaAuthenticationService
          .forgotPasswordConfirm2fa(this.nationalIdInfo.value, this.otpCode)
          .pipe(takeUntil(this.destroyObservable))
          .subscribe((res) => {
            if (res?.success) {
              this.resetToken = res.result.resetPasswordToken;
              this.activeStep = ERegisterSteps.InsertPassword;
            } else {
              if (res?.error?.code == ErrorCodes.InvalidOtp) {
                this.otpHasError = true;
                this.otpErrorInfo = res.error;
                this.otpErrorInfo['title'] = 'کد وارد‌شده اشتباه است';
              } else if (res?.error?.code == ErrorCodes.RateLimited || res?.error?.code == ErrorCodes.UserIsLockedOut) {
                this.timerFinish();
                this.rateLimit = true;
                this.reInitializeTimer(300);
                this.messageService.showErrorMessage('درخواست شما بیش از حد مجاز است. لطفا دقایقی صبر کنید.');
              } else {
                if (res && res.error && res.error.title) {
                  this.messageService.showErrorMessage(res.error.title);
                }
              }
            }
            this.loading = false;
          });
        break;
      case 'CREATE_NEW_PASSWORD':
        this.loading = true;

        if (this.password.value !== this.passwordRepeat.value) {
          this.messageService.showErrorMessage('رمز عبور و تکرار آن برابر نیستند');
          this.loading = false;
        } else {
          this.maknaAuthenticationService
            .resetPassword(this.nationalIdInfo.value, this.resetToken, this.password.value)
            .pipe(takeUntil(this.destroyObservable))
            .subscribe((res) => {
              if (res?.success) {
                this.messageService.showSuccessMessage('رمز عبور با موفقیت تغییر کرد.');
                this.navigationService.navigate([LOGIN_ROUTE]);
              } else if (res?.error?.code == ErrorCodes.RateLimited || res?.error?.code == ErrorCodes.UserIsLockedOut) {
                this.rateLimit = true;
                this.reInitializeTimer(300);
                this.messageService.showErrorMessage('درخواست شما بیش از حد مجاز است. لطفا دقایقی صبر کنید.');
              } else {
                this.messageService.showErrorMessage(res.error?.title || res.error?.error?.title);
              }

              this.loading = false;
            });
        }
        break;
    }
  }

  onPasswordChanged(password: PasswordComplexityOutput) {
    this.password = password;
  }

  onRepeatPasswordChanged(password: PasswordComplexityOutput) {
    this.passwordRepeat = password;
  }

  onFormValidation(validation: FormOutputModel) {
    this.nationalIdInfo = validation;
  }

  private getOtp() {
    this.timeIsOver = false;
    this.loading = true;
    this.maknaAuthenticationService
      .forgotPassword(this.nationalIdInfo.value)
      .pipe(takeUntil(this.destroyObservable))
      .subscribe((res) => {
        if (res?.success) {
          this.inOTPStep = true;
          const splitedNumber = res.result.maskedPhoneNumber.split('*****');
          this.phoneNumber = splitedNumber[1] + '*****' + splitedNumber[0];
        } else {
          if (res?.error?.code == ErrorCodes.InvalidOtp) {
            this.otpHasError = true;
            this.otpErrorInfo = res.error;
            this.otpErrorInfo['title'] = 'کد وارد‌شده اشتباه است';
          } else if (res?.error?.code == ErrorCodes.RateLimited || res?.error?.code == ErrorCodes.UserIsLockedOut) {
            this.timerFinish();
            this.rateLimit = true;
            this.reInitializeTimer(300);
            this.messageService.showErrorMessage('درخواست شما بیش از حد مجاز است. لطفا دقایقی صبر کنید.');
          } else if (res?.error?.code == ErrorCodes.UserNotFound) {
            this.messageService.showErrorMessage('شما هنوز ثبت نام نکرده‌اید');
          } else {
            if (res && res.error && res.error.title) {
              this.messageService.showErrorMessage(res.error.title);
            }
          }
        }

        this.loading = false;
      });
  }
}
