import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import {
  StepConfigAction
} from '../../../../../../../../../api/clients/registration-v3/basic-models/step-result-config.model';
import { Router } from '@angular/router';

import { SmartDialog } from '../../../../../../../../../user-interface/services/smart-dialog';
import {
  ES_LOAN_REGISTRATION_ICS_REPORTING_STATES,
  EsLoanRegistrationIcsReportingConfig
} from '../../../../../../../../../api/clients/es-loan-registration/es-loan-registration-ics-reporting-config';
import {
  EsLoanRegistrationIcsReportingMoreInfoDialogComponent
} from './es-loan-registration-ics-reporting-more-info-dialog/es-loan-registration-ics-reporting-more-info-dialog.component';
import {
  EsLoanStateModel
} from '../../../../../../../../../api/clients/es-loan-registration/models/es-loan-get-steps.response';
import {
  EsLoanRegistrationApiService
} from '../../../../../../../../../api/clients/es-loan-registration/es-loan-registration-api.service';
import { MessageService } from '../../../../../../../../../core/message.service';

@Component({
  selector: 'es-loan-registration-ics-reporting-check-score-step',
  standalone: true,
  imports: [
    NgxStatusResultModule
  ],
  templateUrl: './es-loan-registration-ics-reporting-check-score-step.component.html',
  styleUrl: './es-loan-registration-ics-reporting-check-score-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRegistrationIcsReportingCheckScoreStepComponent implements OnInit {
  errorData!: StepConfigAction;
  esLoanStateModel = input<EsLoanStateModel>();
  ES_LOAN_REGISTRATION_ICS_REPORTING_STATES = ES_LOAN_REGISTRATION_ICS_REPORTING_STATES;
  errorStatus!: ES_LOAN_REGISTRATION_ICS_REPORTING_STATES;

  esLoanRegistrationApiService = inject(EsLoanRegistrationApiService);
  messageService = inject(MessageService);
  router = inject(Router);
  smartDialog = inject(SmartDialog);

  ngOnInit(): void {
    this.getStep();
  }

  onClick(id: string) {
    if (id === 'primary') {
      this.closeClick();
    } else if (id === 'secondary') {
      this.moreInfoClick();
    }
  }

  closeClick() {
    this.router.navigate(['/es-loan-registration/overview'], {
      replaceUrl: true
    });
  }

  moreInfoClick() {
    this.smartDialog.open(EsLoanRegistrationIcsReportingMoreInfoDialogComponent);
  }

  getStep() {
    this.esLoanRegistrationApiService.getSteps().subscribe({
      next: (stepRes) => {
        const state = stepRes.esLoanStateModel.state as ES_LOAN_REGISTRATION_ICS_REPORTING_STATES;
        const action: StepConfigAction = EsLoanRegistrationIcsReportingConfig[state];
        this.errorData = action;
      }, error: (error) => {
        this.messageService.showErrorIfExists(error);
      }
    });
  }

}
