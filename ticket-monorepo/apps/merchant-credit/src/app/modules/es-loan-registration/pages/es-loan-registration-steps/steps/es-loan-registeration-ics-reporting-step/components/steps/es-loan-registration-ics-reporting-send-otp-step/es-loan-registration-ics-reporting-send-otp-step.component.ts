import { ChangeDetectionStrategy, Component, inject, input, model, output, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { Merchant } from '../../../../../../../../../api/clients/es-loan-dashboard/es-loan-profile.model';
import {
  EsLoanRegistrationIcsReportingSteps
} from '../../../../../../../../../api/clients/es-loan-registration/models/es-loan-registration-ics-reporting-steps';
import { NgIf } from '@angular/common';
import { UiFormModule } from '../../../../../../../../../user-interface/ui-components/ui-form/ui-form.module';
import { UiTimeModule } from '../../../../../../../../../user-interface/ui-components/ui-time/ui-time.module';
import { RegistrationUiModule } from '../../../../../../../../../sub-modules/registration-ui/registration-ui.module';
import {
  EsLoanOtpInputComponent
} from '../../../../../../../../../sub-modules/es-loan-ui/es-loan-otp-input/es-loan-otp-input.component';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { NgxIcon } from '@digipay/ngx-icon';
import {
  EsLoanRegistrationApiService
} from '../../../../../../../../../api/clients/es-loan-registration/es-loan-registration-api.service';
import { MessageService } from '../../../../../../../../../core/message.service';

@Component({
  selector: 'es-loan-registration-ics-reporting-send-otp-step',
  standalone: true,
  imports: [
    NgxButtonComponent,
    NgxDividerComponent,
    NgIf,
    UiFormModule,
    UiTimeModule,
    RegistrationUiModule,
    EsLoanOtpInputComponent,
    NgxCountDownComponent,
    NgxIcon
  ],
  templateUrl: './es-loan-registration-ics-reporting-send-otp-step.component.html',
  styleUrl: './es-loan-registration-ics-reporting-send-otp-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRegistrationIcsReportingSendOtpStepComponent {
  profile = input<Merchant>({} as Merchant);
  trackingCode = model<string>('');
  registrationId = input('');
  countdownSeconds = input<number>(120);

  code = signal<string>('');
  errorMessage = signal<string>('');
  canProceed = signal<boolean>(false);
  resendEnabled = signal<boolean>(false);
  verifyingOtp = signal<boolean>(false);
  resendingOtp = signal<boolean>(false);

  activeStepIndex = output<number>();

  esLoanRegistrationIcsReportingSteps = EsLoanRegistrationIcsReportingSteps;

  esLoanRegistrationApiService = inject(EsLoanRegistrationApiService);
  messageService = inject(MessageService);

  onSubmit() {
    this.esLoanRegistrationApiService.getOtp(this.trackingCode(), this.code()).subscribe({
      next: (res) => {
        this.activeStepIndex.emit(this.esLoanRegistrationIcsReportingSteps.ES_LOAN_ICS_REPORTING_CHECK_SCORE);
      },
      error: (error) => {
        this.errorMessage.set('کد وارد شده اشتباه است.');
        this.messageService.showErrorIfExists(error);
      }
    });
  }

  onCodeChange(code: string): void {
    this.errorMessage.set('');
    this.code.set(code);
    if (code && code.length >= 5) {
      this.canProceed.set(true);
    }
  }

  onCountdownFinish(): void {
    this.resendEnabled.set(true);
    this.errorMessage.set('');
  }

  resendOtp() {
    this.resendingOtp.set(true);
    this.esLoanRegistrationApiService.sendOtp(this.registrationId()).subscribe({
      next: (res) => {
        this.trackingCode.set(res.trackingCode);
        this.resendEnabled.set(false);
        this.resendingOtp.set(false);
      },
      error: (error) => {
        this.messageService.showErrorIfExists(error);
        this.resendingOtp.set(false);
      }
    });
  }
}
