import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CreditPassWordRegistrationStatus } from '../../../data-access/models/credit/generate-digital-signature/password-signature/credit-password-registration-status';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditGenerateDigitalSignatureService } from '../services/credit-generate-digital-signature.service';
import { CreditUrlService } from '../../../data-access/utils/url';
import { DigitalSignatureStepperUrl } from '../credit-generate-digital-signature-step/general-digital-signature-steps.model';
import { NgxStateService, NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditGenerateDigitalSignaturePasswordSuccessComponent } from './credit-generate-digital-signature-password-success/credit-generate-digital-signature-password-success.component';
import { CreditGenerateDigitalSignatureConfirmComponent } from './credit-generate-digital-signature-confirm/credit-generate-digital-signature-confirm.component';
import { CreditGenerateDigitalSignaturePasswordExpiredComponent } from './credit-generate-digital-signature-password-expired/credit-generate-digital-signature-password-expired.component';
import { CreditPasswordSignatureComponent } from '../../../components/credit-password-signature/credit-password-signature.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

const CREDIT_DIGITAL_SIGNATURE_PASSWORD_INCORRECT = 5372;
const CREDIT_DIGITAL_SIGNATURE_PASSWORD_EXPIRED = 5373;
const CREDIT_DIGITAL_SIGNATURE_NOT_FOUND = 16108;

@Component({
  selector: 'app-credit-generate-digital-signature-password',
  templateUrl: './credit-generate-digital-signature-password.component.html',
  styleUrls: ['./credit-generate-digital-signature-password.component.scss'],
  imports: [
    NgxStatusResultModule,
    CreditGenerateDigitalSignaturePasswordSuccessComponent,
    CreditGenerateDigitalSignatureConfirmComponent,
    CreditGenerateDigitalSignaturePasswordExpiredComponent,
    CreditPasswordSignatureComponent,
    CreditAppBarComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignaturePasswordComponent implements OnInit {
  creditId = '';
  fundProviderCode = '';
  password = '';
  confirmPassword = '';
  errorText = signal<string>('');
  actionText = signal<string>('امضای دیجیتال');
  buttons: Buttons[] = [
    {
      label: 'متوجه شدم',
      id: 'primary',
      style: 'tinted-on-elevated',
      mode: 'form',
    },
  ];
  loadingForApiCall = signal(false);
  expired = signal(false);
  expiredErrorDescription = signal<string>('');
  validatingPassword = signal(false);
  protected readonly CreditPassWordRegistrationStatus = CreditPassWordRegistrationStatus;
  step = signal<CreditPassWordRegistrationStatus>(this.CreditPassWordRegistrationStatus.REGISTRATION_STEP);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private creditApiService = inject(CreditApiService);
  private creditUrlService = inject(CreditUrlService);
  private creditGenerateDigitalSignatureService = inject(CreditGenerateDigitalSignatureService);
  private ngxStateService = inject(NgxStateService);

  ngOnInit() {
    this.creditId = this.activatedRoute.parent?.snapshot.params['creditId'];
    this.fundProviderCode = this.activatedRoute.parent?.snapshot.params['fundProviderCode'];
    const currentStep = this.activatedRoute.snapshot.url[0].path;
    this.creditGenerateDigitalSignatureService.setCurrentStep(currentStep);
    this.creditGenerateDigitalSignatureService.setDigitalSignatureAutoNavigation(false);
    if (this.activatedRoute.parent?.snapshot.queryParams['validation']) {
      this.step.set(this.CreditPassWordRegistrationStatus.VALIDATION_STEP);
      this.validatingPassword.set(true);
      return;
    }
    this.openDigitalSignatureInfoBottomSheet();
  }

  openDigitalSignatureInfoBottomSheet() {
    this.ngxStateService.openBottomSheet(
      {
        title: 'امضای دیجیتال',
        description:
          'در ادامه رمز دلخواه خود را برای امضای دیجیتال تنظیم کنید و این رمز را تا پایان مدت اعتبار امضا (یک سال) در جایی امن نگه دارید.',
        icon: 'info',
        type: 'Status',
        buttons: [
          {
            id: 'digitalSignatureRevokePasswordConfirmButton',
            style: 'fill',
            label: 'متوجه شدم',
            mode: 'form',
            fullWidth: true,
          },
        ],
      },
      { disableClose: true },
    );
  }

  openForgetPasswordBottomSheet() {
    this.ngxStateService.openBottomSheet(
      {
        title: 'فراموشی رمز امضای دیجیتال',
        description: 'در صورتی که رمز خود را فراموش کرده‌ باشید باید امضای خود را حذف و دوباره اقدام به ساخت امضای دیجیتال نمایید.',
        icon: 'question',
        type: 'Confirmation',
        buttons: [
          {
            id: 'digitalSignatureRevokePasswordCancelButton',
            style: 'tinted-on-elevated',
            label: 'لغو',
            mode: 'form',
            fullWidth: true,
          },
          {
            id: 'digitalSignatureRevokePasswordConfirmButton',
            style: 'fill',
            label: 'حذف امضا',
            mode: 'form',
            fullWidth: true,
          },
        ],
      },
      { disableClose: true },
    );

    const onClose = this.ngxStateService.onClose().subscribe(() => {
      onClose.unsubscribe();
      const data = this.ngxStateService.outputData();
      if (data && data.clicked === 'digitalSignatureRevokePasswordConfirmButton') {
        this.revokeDigitalSignature();
      }
    });
  }

  revokeDigitalSignature() {
    this.loadingForApiCall.set(true);
    this.creditApiService.revokeCreditDigitalSignature(this.creditId).subscribe({
      next: () => {
        this.backToStepper();
      },
      error: (error) => {
        this.loadingForApiCall.set(false);
        this.creditGenerateDigitalSignatureService.handleError(error);
      },
    });
  }

  handleToChangeStep(event: { step: number; password: string }) {
    this.clearError();
    this.step.set(event.step);
    this.password = event.password;
    if (event.step === this.CreditPassWordRegistrationStatus.VERIFICATION_STEP) {
      this.actionText.set('امضای دیجیتال');
    }

    if (this.checkPasswordLength(event.password)) {
      this.setErrorText('رمز باید ۴ رقمی باشد');
    }
  }

  handleToSubmit(event: { step: number; password: string }) {
    this.clearError();
    this.confirmPassword = event.password;

    if (this.checkPasswordLength(event.password)) {
      this.setErrorText('رمز باید ۴ رقمی باشد');
      return;
    }

    if (this.step() === this.CreditPassWordRegistrationStatus.VALIDATION_STEP) {
      this.validatePassword(event.password);
      return;
    }

    if (this.checkPasswordValidation()) {
      this.setErrorText('تکرار رمز با رمز واردشده در مرحله قبل یکسان نیست.');
      return;
    }

    this.step.set(this.CreditPassWordRegistrationStatus.CONFIRMATION_STEP);
    this.actionText.set('امضای دیجیتال');
  }

  checkPasswordLength(password: string): boolean {
    return password.length !== 4;
  }

  checkPasswordValidation() {
    return this.password !== this.confirmPassword;
  }

  onKeyBoardHitError() {
    this.setErrorText('رمزتان را توسط کیبورد همین صفحه وارد کنید.');
  }

  clearError() {
    this.errorText.set('');
  }

  setErrorText(text: string) {
    this.errorText.set(text);
  }

  goBack() {
    this.clearError();
    this.actionText.set('امضای دیجیتال');
    this.step.update((step) => step - 1);
    if (this.step() < 0) {
      this.backToStepper();
    }
  }

  validatePassword(password: string) {
    this.loadingForApiCall.set(true);
    this.creditApiService.validateDigitalSignature(this.creditId, password).subscribe({
      next: () => {
        this.loadingForApiCall.set(false);
        this.step.set(this.CreditPassWordRegistrationStatus.FINAL_STEP);
      },
      error: (error) => {
        if (error && error.result) {
          if (error.result.status === CREDIT_DIGITAL_SIGNATURE_PASSWORD_INCORRECT) {
            this.errorText.set(error.result.message);
            this.loadingForApiCall.set(false);
            return;
          }
          if (error.result.status === CREDIT_DIGITAL_SIGNATURE_PASSWORD_EXPIRED) {
            this.loadingForApiCall.set(false);
            this.expiredErrorDescription.set(
              'به دلیل تکرار در اشتباه وارد کردن رمز بیش از حد مجاز، امضای دیجیتال شما منقضی شد. لطفا برای ساخت امضای جدید دوباره اقدام نمائید.',
            );
            this.expired.set(true);
            return;
          }
          if (error.result.status === CREDIT_DIGITAL_SIGNATURE_NOT_FOUND) {
            this.loadingForApiCall.set(false);
            this.expiredErrorDescription.set(
              'اعتبار یک‌ساله‌ی امضای دیجیتال شما به پایان رسیده‌است و در صورت نیاز باید دوباره اقدام به ساخت امضا کنید.',
            );
            this.expired.set(true);
            return;
          }
          this.creditGenerateDigitalSignatureService.handleError(error);
          this.loadingForApiCall.set(false);
        }
      },
    });
  }

  submitPassword() {
    this.step.set(CreditPassWordRegistrationStatus.FINAL_STEP);
  }

  generateDigitalSignature() {
    this.loadingForApiCall.set(true);
    if (this.validatingPassword()) {
      this.nextStep();
      return;
    }
    this.creditApiService.generateDigitalSignature(this.creditId, this.confirmPassword).subscribe({
      next: () => {
        this.nextStep();
        this.loadingForApiCall.set(false);
      },
      error: (error) => {
        this.creditGenerateDigitalSignatureService.handleError(error);
        this.loadingForApiCall.set(false);
        return;
      },
    });
  }

  backToStepper() {
    if (this.step() === this.CreditPassWordRegistrationStatus.VALIDATION_STEP && !this.expired()) {
      this.backToCreditStepper();
      return;
    }
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode}/${this.creditId}`),
    );
  }

  backToCreditStepper() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`),
    );
  }

  nextStep(): void {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}/next`),
    );
  }
}
