import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { OtpComponent } from '../components/otp/otp.component';
import { ForgotPasswordStepEnum } from '../data-access/models/forgot-password-step.enum';
import { ForgotPasswordPinComponent } from '../components/pin/forgot-password-pin.component';
import { NidComponent } from '../components/nid/nid.component';
import { PhoneComponent } from '../components/phone/phone.component';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { PIN_VALIDITY_PERIOD } from '../data-access/consts/pin-validity-period';
import { ForgotPasswordNavigationService } from '../data-access/services/forgot-password-navigation.service';
import { ForgotPasswordService } from '../data-access/services/forgot-password.service';
import { finalize, Subscription } from 'rxjs';
import { ForgotPasswordErrorEnum } from '../data-access/models/forgot-password-error.enum';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

@Component({
  selector: 'forgot-password-applet',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    OtpComponent,
    ForgotPasswordPinComponent,
    NidComponent,
    PhoneComponent,
    NgxSpinnerModule,
    NgxStatusResultModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  stepPage = signal<ForgotPasswordStepEnum>(ForgotPasswordStepEnum.PHONE_NUMBER);
  time = signal(PIN_VALIDITY_PERIOD);
  loadingPage = signal(true);
  isTimeout = signal(false);
  defaultPhoneNumber = computed(() => {
    return this.forgotPasswordService?.defaultPhoneNumber();
  });

  backHandler = inject(BackHandlerService);
  forgotPasswordNavigationService = inject(ForgotPasswordNavigationService);
  forgotPasswordService = inject(ForgotPasswordService);
  messageService = inject(MessageService);
  subscriptions: Subscription[] = [];

  constructor() {
    this.handlePreProcessingSteps();
  }

  ngOnInit() {
    this.forgotPasswordNavigationService.setNavigationParams();
  }

  handlePreProcessingSteps() {
    const getDataSub = this.forgotPasswordService.preprocessingSteps().subscribe((result) => {
      if (result.userProfile) {
        this.forgotPasswordService
          .sendOtpRequest(result.userProfile)
          .pipe(
            finalize(() => {
              this.loadingPage.set(false);
            }),
          )
          .subscribe({
            next: () => {
              this.stepPage.set(ForgotPasswordStepEnum.OTP);
            },
            error: (error) => {
              if (error.error.result.status === ForgotPasswordErrorEnum.OTP_DUPLICATE) {
                this.messageService.showInfoMessage('کد بازیابی ارسال شده همچنان معتبر است. لطفاً آن را مجددا وارد کنید.');
                this.stepPage.set(ForgotPasswordStepEnum.OTP);
                return;
              }
              this.stepPage.set(ForgotPasswordStepEnum.PHONE_NUMBER);
              this.messageService.showErrorMessage(error.error.result.message);
            },
          });
      } else {
        this.stepPage.set(ForgotPasswordStepEnum.PHONE_NUMBER);
        this.loadingPage.set(false);
      }
    });
    this.subscriptions.push(getDataSub);
  }

  handleBackClick() {
    switch (this.stepPage()) {
      case ForgotPasswordStepEnum.PHONE_NUMBER:
        this.forgotPasswordNavigationService.exit('failed');
        break;
      case ForgotPasswordStepEnum.OTP:
        if (this.defaultPhoneNumber()) {
          this.forgotPasswordNavigationService.exit('failed');
        } else {
          this.stepPage.set(ForgotPasswordStepEnum.PHONE_NUMBER);
        }
        break;
      case ForgotPasswordStepEnum.PIN:
        this.stepPage.set(ForgotPasswordStepEnum.OTP);
        break;
      case ForgotPasswordStepEnum.NID:
        this.stepPage.set(ForgotPasswordStepEnum.PIN);
    }
  }

  onFinish() {
    this.isTimeout.set(true);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  protected readonly ForgotPasswordStepEnum = ForgotPasswordStepEnum;
}
