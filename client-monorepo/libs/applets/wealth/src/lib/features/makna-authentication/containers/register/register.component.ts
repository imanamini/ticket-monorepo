import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ERegisterSteps } from '../../models/register-steps.enum';
import { StepperComponent } from '../../components/stepper/stepper.component';
import { PasswordComplexityComponent } from '../../components/password-complexity/password-complexity.component';
import { MaknaAuthenticationService } from '../../services/makna-authentication.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { takeUntil } from 'rxjs';
import { MaknaHeaderComponent } from '../../../../shared/components/makna-header/makna-header.component';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { FormErrorStatus } from '../../../../data-access/models/form-error-status.model';
import { PasswordComplexityOutput } from '../../../../data-access/models/password-complexity-output.model';
import { ResponseError } from '../../../../data-access/models/response-error.model';
import { validateNationalId } from '../../../../components/utils/strings';
import { HOME_ROUTE, LOGIN_ROUTE } from '../../../../data-access/constants/app-routes';
import { ErrorCodes } from '../../../../data-access/enums/error-codes';
import { WEALTH_TOKEN } from '../../../../components/utils/variables';

import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { MessageService } from '@client-monorepo/common/utilities';
import { PinInputComponent } from '../../../../shared/components/pin-input/pin-input.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [
    StepperComponent,
    NgxButtonComponent,
    ReactiveFormsModule,
    MaknaHeaderComponent,
    UiFormFieldBuilderModule,
    PasswordComplexityComponent,
    NgxCountDownComponent,
    PinInputComponent,
  ],
})
export class RegisterComponent extends BaseComponent implements OnInit {
  loading = false;
  activeStep: number = ERegisterSteps.InsertPhoneNumber;
  _activeStep = ERegisterSteps;
  inOTPStep = false;
  phoneNumberForm: FormGroup;
  nationalIdForm: FormGroup;

  nationalIdNotMatchError = false;
  showNationalIdError: FormErrorStatus = 'hidden';
  showPhoneNumberError: FormErrorStatus = 'hidden';
  phoneNumberInvalidErrorMessage = 'شماره موبایل نامعتبر است';
  nationalCodeErrorMessage = 'کد ملی نامعتبر است';
  phoneNumberRegisteredErrorMessage = 'این شماره موبایل قبلا ثبت شده است.';
  nationalIDNotMatchErrorMessage = 'این کد ملی متعلق به شماره موبایل وارد شده نیست';
  otpCode = '';
  password: PasswordComplexityOutput;
  timeIsOver = false;
  otpSecounds = 120;
  otpHasError = false;
  passwordRepeat: PasswordComplexityOutput;
  otpErrorInfo: ResponseError | null = null;
  rateLimit: boolean;
  expireOtp: boolean;
  navigationService = inject(WealthNavigationService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  private maknaAuthenticationService = inject(MaknaAuthenticationService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.phoneNumberForm = this.fb.group({
      cellNumber: ['', [Validators.required, Validators.pattern('^(09)(0[0-3]|1[0-9]|2[0-2]|3[0-9]|9[0-9])\\d{7}$')]],
    });

    this.nationalIdForm = this.fb.group({
      nationalCode: ['', [Validators.required, this.nationalCodeValidator, Validators.minLength(10)]],
    });
  }

  nationalCodeValidator(control: AbstractControl): { [s: string]: boolean } {
    if (validateNationalId(control.value)) {
      return null;
    }
    return { invalidNotionalCode: true };
  }

  onBackClicked() {
    this.navigationService.navigate([LOGIN_ROUTE]);
  }

  pinChanged(val: string) {
    this.otpHasError = false;
    this.otpCode = val;
  }

  onNextStep(step: string) {
    switch (step) {
      case 'GET_OTP':
        this.timeIsOver = false;
        this.otpSecounds = 120;
        this.loading = true;
        this.pinChanged('');
        this.maknaAuthenticationService
          .registerOtp(this.phoneNumberForm.get('cellNumber').value)
          .pipe(takeUntil(this.destroyObservable))
          .subscribe((res) => {
            if (res?.success) {
              this.inOTPStep = true;
            }
            this.loading = false;
          });
        break;
      case 'GET_NATIONAL_ID':
        this.loading = true;

        this.maknaAuthenticationService
          .confirmPhoneNumber(this.phoneNumberForm.get('cellNumber').value, this.otpCode)
          .pipe(takeUntil(this.destroyObservable))
          .subscribe((res) => {
            if (res?.success) {
              if (res.result.accessToken) {
                localStorage.setItem(WEALTH_TOKEN, JSON.stringify(res.result) || '{}');
              }
              this.inOTPStep = false;
              this.activeStep = ERegisterSteps.InsertNationalID;
            } else {
              if (res?.error?.code == ErrorCodes.InvalidOtp) {
                this.otpHasError = true;
                this.otpErrorInfo = res.error;
                this.otpErrorInfo['title'] = 'کد وارد‌شده اشتباه است';
                this.loading = false;
                return;
              } else if (res?.error?.code == ErrorCodes.RateLimited || res?.error?.code == ErrorCodes.UserIsLockedOut) {
                this.timerFinish();
                this.rateLimit = true;
                this.reInitializeTimer(300);
                this.messageService.showErrorMessage('درخواست شما بیش از حد مجاز است. لطفا دقایقی صبر کنید.');
              } else if (res?.error?.code == ErrorCodes.ExpiredOtp) {
                this.messageService.showErrorMessage('کد شما منقضی شده است.');
                this.expireOtp = true;
                this.otpHasError = true;
              } else {
                this.messageService.showErrorMessage(this.generateMessage(res.error.title));
              }
              this.loading = false;
            }
            this.timerFinish();
            this.loading = false;
          });
        break;
      case 'CREATE_PASSWORD':
        this.loading = true;
        this.maknaAuthenticationService
          .confirmNationalId(this.nationalIdForm.get('nationalCode').value)
          .pipe(takeUntil(this.destroyObservable))
          .subscribe((res) => {
            if (res?.success) {
              this.activeStep = ERegisterSteps.InsertPassword;
            } else {
              if (res?.error?.code === ErrorCodes.kYCShahkarCellNumberMissmatchNationalId) {
                this.nationalIdNotMatchError = true;
              } else if (res?.error?.code === ErrorCodes.KYCShahkarFailed) {
                this.messageService.showErrorMessage('اطلاعات ورودی اشتباه است.');
              } else if (res?.error?.code == ErrorCodes.RateLimited || res?.error?.code == ErrorCodes.UserIsLockedOut) {
                this.timeIsOver = false;
                this.rateLimit = true;
                this.otpSecounds = 300;
                this.messageService.showErrorMessage('درخواست شما بیش از حد مجاز است. لطفا دقایقی صبر کنید.');
              } else {
                this.messageService.showErrorMessage(this.generateMessage(res.error.title));
              }
            }
            this.loading = false;
          });
        break;
      case 'LOGIN':
        this.timerFinish();
        this.activeStep = ERegisterSteps.InsertPhoneNumber;
        this.navigationService.navigate([LOGIN_ROUTE]);
        break;
      case 'REGISTER_USER':
        this.timerFinish();
        this.register();
        break;
    }
  }

  timerFinish() {
    this.timeIsOver = true;
    this.rateLimit = false;
    this.expireOtp = false;
  }

  onPasswordChanged(password: PasswordComplexityOutput) {
    this.password = password;
  }

  onRepeatPasswordChanged(password: PasswordComplexityOutput) {
    this.passwordRepeat = password;
  }

  private register() {
    /**
     * password and repeatPasswors id not equal
     */
    if (this.password.value != this.passwordRepeat.value) {
      this.messageService.showErrorMessage('رمز عبور و تکرار آن برابر نیستند');
    } else {
      this.loading = true;

      if (!this.checkPassword(this.password.value)) {
        this.messageService.showErrorMessage('فقط کاراکتر انگلیسی مورد قبول است.');
      } else {
        this.maknaAuthenticationService
          .addPassword(this.password.value)
          .pipe(takeUntil(this.destroyObservable))
          .subscribe((res) => {
            if (res?.success) {
              this.navigationService.navigate([HOME_ROUTE]);
            } else {
              if (res?.error?.code == ErrorCodes.RateLimited || res?.error?.code == ErrorCodes.UserIsLockedOut) {
                this.timeIsOver = false;
                this.rateLimit = true;
                this.otpSecounds = 300;
                this.messageService.showErrorMessage('درخواست شما بیش از حد مجاز است. لطفا دقایقی صبر کنید.');
              } else {
                this.messageService.showErrorMessage(this.generateMessage(res.error.title));
              }
            }
            this.loading = false;
          });
      }
      this.loading = false;
    }
  }

  phoneNumberChanged() {
    this.showPhoneNumberError = 'hidden';
  }

  nationalIdChanged() {
    this.nationalIdNotMatchError = false;
  }

  reInitializeTimer(sec) {
    this.timeIsOver = true;
    setTimeout(() => {
      this.timeIsOver = false;
      this.otpSecounds = sec;
      this.cdr.detectChanges();
    }, 0);
  }

  private checkPassword(password: string): boolean {
    const reg = /^[a-zA-Z0-9!@#$%^&*()\-+]{8,}$/;
    if (!reg.test(password)) {
      return false;
    }

    return true;
  }

  private generateMessage(message: string): string {
    const regex = /09\d*\*{5}\d{2}/;
    if (regex.test(message)) {
      message = message.replace(regex, (match) => {
        const splitedNumber = match.split('*****');
        return splitedNumber[1] + '*****' + splitedNumber[0];
      });
    }

    return message;
  }
}
