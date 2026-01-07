import { Component, inject, signal } from '@angular/core';
import { EsLoanSamanBaseStepComponent } from '../es-loan-saman-base-step/es-loan-saman-base-step.component';
import { SmartDialog } from '../../../../../../../../../user-interface/services/smart-dialog';
import {
  StepConfigAction
} from '../../../../../../../../../api/clients/registration-v3/basic-models/step-result-config.model';
import { IcsMoreInfoDialogComponent } from '../../../../../../../../registration-v3/components';
import {
  ES_LOAN_ICS_STATES, EsLoanStepResultConfig
} from '../../../../../../../../../api/clients/es-loan-registration/es-loan-step-result-config';
import { Router } from '@angular/router';

@Component({
  selector: 'es-loan-saman-identity-evaluation-step',
  templateUrl: './es-loan-saman-identity-evaluation-step.component.html',
  styleUrl: './es-loan-saman-identity-evaluation-step.component.scss'
})
export class EsLoanSamanIdentityEvaluationStepComponent extends EsLoanSamanBaseStepComponent {

  errorData = signal<any>({} as any);
  errorStatus = signal<ES_LOAN_ICS_STATES>({} as ES_LOAN_ICS_STATES);

  smartDialog = inject(SmartDialog);
  router = inject(Router);

  ngOnInit(): void {
    this.errorStatus.set(this.details()?.registration?.currentState);
    const action: StepConfigAction = EsLoanStepResultConfig[this.errorStatus()];
    if (action) {
      this.errorData.set(action);
    }
    this.changeStep();
  }

  changeStep() {
    setTimeout(() => {
      this.reloadDataEvent.emit(true);
    }, 60000);
  }

  closeClick() {
    this.router.navigate(['/es-loan-registration/overview'], {
      replaceUrl: true
    });
  }

  moreInfoClick() {
    this.smartDialog.open(IcsMoreInfoDialogComponent);
  }

  onClick(id: string) {
    if (id === 'primary') {
      this.closeClick();
    } else if (id === 'secondary') {
      this.moreInfoClick();
    }
  }
}
