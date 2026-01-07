import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgIf } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Merchant } from '../../../../../../../../../api/clients/es-loan-dashboard/es-loan-profile.model';
import {
  EsLoanRegistrationIcsReportingSteps
} from '../../../../../../../../../api/clients/es-loan-registration/models/es-loan-registration-ics-reporting-steps';
import {
  EsLoanRegistrationApiService
} from '../../../../../../../../../api/clients/es-loan-registration/es-loan-registration-api.service';
import { MessageService } from '../../../../../../../../../core/message.service';

@Component({
  selector: 'es-loan-registration-ics-reporting-confirm-step',
  standalone: true,
  imports: [
    NgxDividerComponent,
    NgIf,
    NgxButtonComponent
  ],
  templateUrl: './es-loan-registration-ics-reporting-confirm-step.component.html',
  styleUrl: './es-loan-registration-ics-reporting-confirm-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRegistrationIcsReportingConfirmStepComponent {

  BorderColorsEnum = BorderColorsEnum;
  activeStepIndex = output<number>();
  sendTrackingCode = output<string>();
  sendRemainTime = output<number>();
  registrationId = input('');
  profile = input<Merchant>({} as Merchant);
  esLoanRegistrationIcsReportingSteps = EsLoanRegistrationIcsReportingSteps;

  esLoanRegistrationApiService = inject(EsLoanRegistrationApiService);
  messageService = inject(MessageService);

  onSubmit() {
    this.esLoanRegistrationApiService.sendOtp(this.registrationId()).subscribe({
      next: (res) => {
        this.sendTrackingCode.emit(res.trackingCode);

        this.sendRemainTime.emit(this.calculateRemainingTimeInSeconds(res.otpExpireDuration));

        this.activeStepIndex.emit(this.esLoanRegistrationIcsReportingSteps.ES_LOAN_ICS_REPORTING_SEND_OTP);
      },
      error: (error) => {
        this.messageService.showErrorIfExists(error);
      }
    });
  }

  calculateRemainingTimeInSeconds(expireTime: number): number {
    const remainingSeconds = (expireTime / 1000);

    return remainingSeconds > 0 ? remainingSeconds : 0;
  }

}
