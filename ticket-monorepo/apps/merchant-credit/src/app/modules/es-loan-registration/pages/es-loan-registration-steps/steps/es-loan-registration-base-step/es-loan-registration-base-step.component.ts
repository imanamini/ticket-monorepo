import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { EsLoanStep } from '../../../../../../api/clients/es-loan-registration/models/es-loan-step';
import { EsLoanStateModel } from '../../../../../../api/clients/es-loan-registration/models/es-loan-get-steps.response';

@Component({
  selector: 'es-loan-registration-base-step',
  templateUrl: './es-loan-registration-base-step.component.html',
  styleUrl: './es-loan-registration-base-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRegistrationBaseStepComponent {
  steps = input<EsLoanStep[]>([]);
  esLoanStateModel = input<EsLoanStateModel>();
  requestAmount = input<number>(0);
  reloadDataEvent = output<boolean>();
}
