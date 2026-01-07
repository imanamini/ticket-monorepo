import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  EsLoanRegistrationBaseStepComponent
} from '../es-loan-registration-base-step/es-loan-registration-base-step.component';
import { Router } from '@angular/router';
import {
  EsLoanDashboardApiService
} from '../../../../../../api/clients/es-loan-dashboard/es-loan-dashboard-api.service';
import { MessageService } from '../../../../../../core/message.service';
import { Merchant } from '../../../../../../api/clients/es-loan-dashboard/es-loan-profile.model';
import {
  EsLoanRegistrationIcsReportingSteps
} from '../../../../../../api/clients/es-loan-registration/models/es-loan-registration-ics-reporting-steps';
import {
  EsLoanRegistrationApiService
} from '../../../../../../api/clients/es-loan-registration/es-loan-registration-api.service';
import {
  ES_LOAN_REGISTRATION_ICS_REPORTING_STATES
} from '../../../../../../api/clients/es-loan-registration/es-loan-registration-ics-reporting-config';

@Component({
  selector: 'es-loan-registeration-ics-reporting-step',
  templateUrl: './es-loan-registeration-ics-reporting-step.component.html',
  styleUrl: './es-loan-registeration-ics-reporting-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRegisterationIcsReportingStepComponent extends EsLoanRegistrationBaseStepComponent implements OnInit {
  activeStepIndex = signal<number>(0);
  profile = signal<Merchant>({} as Merchant);
  creditId = signal<string>('');
  esLoanRegistrationIcsReportingSteps = EsLoanRegistrationIcsReportingSteps;
  registrationId = signal('');
  trackingCode = signal('');
  remainTime = signal<number>(0);

  router = inject(Router);
  api = inject(EsLoanDashboardApiService);
  messageService = inject(MessageService);
  esLoanRegistrationApiService = inject(EsLoanRegistrationApiService);

  ngOnInit() {
    if (this.esLoanStateModel()?.state === ES_LOAN_REGISTRATION_ICS_REPORTING_STATES.KYB_REJECT || this.esLoanStateModel()?.state === ES_LOAN_REGISTRATION_ICS_REPORTING_STATES.ICS_GENERATE_REPORT_WAITING || this.esLoanStateModel()?.state === ES_LOAN_REGISTRATION_ICS_REPORTING_STATES.KYB_WAITING) {
      const activeDefaultStep = 2;
      this.activeStepIndex.set(activeDefaultStep);
    }
    this.geProfileData();
    this.getRegistrationId();

  }

  closeClick() {
    this.router.navigate(['/es-loan-registration/overview'], {
      replaceUrl: true
    });
  }

  getActiveStepIndex(activeStepIndex: number) {
    this.activeStepIndex.set(activeStepIndex);
  }

  geProfileData() {
    this.api.getProfile().subscribe(res => {
      this.profile.set(res.merchant);
      this.creditId.set(this.profile().creditId);
    }, error => {
      this.messageService.showErrorIfExists(error);
    });
  }

  getTrackingCode(trackingCode: string) {
    this.trackingCode.set(trackingCode);
  }

  getRemainingTime(time: number) {
    this.remainTime.set(time);
  }

  getRegistrationId() {
    // Get registrationId
    this.esLoanRegistrationApiService.getRegistrationIdFromDetail().subscribe({
      next: (res) => {
        this.registrationId.set(res.registrationId);
      }, error: (error) => {
        this.messageService.showErrorIfExists(error);
      }
    });
  }
}


