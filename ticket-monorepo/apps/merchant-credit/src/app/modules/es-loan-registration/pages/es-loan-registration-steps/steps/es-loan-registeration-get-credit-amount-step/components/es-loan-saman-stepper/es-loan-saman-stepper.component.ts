import {
  ChangeDetectionStrategy,
  Component, input,
  OnChanges,
  output,
  signal,
  SimpleChanges
} from '@angular/core';
import {
  RegistrationStep
} from '../../../../../../../../api/clients/registration-v3/basic-models/registration-v3-step.model';
import { RegistrationStatus } from '../../../../../../../../api/clients/registration/basic-models/registration-status';
import { StepTagData } from '../../../../../../../registration/stepper/step-tag-data';
import { numberMapper } from '../../../../../../../../api/clients/registration/basic-models/numberMapper';

type StepStatus = 'active' | 'success' | 'disabled' | 'rejected';

interface TransformedStep extends RegistrationStep {
  status: StepStatus;
}

@Component({
  selector: 'es-loan-saman-stepper',
  templateUrl: './es-loan-saman-stepper.component.html',
  styleUrl: './es-loan-saman-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanSamanStepperComponent implements OnChanges {
  steps = input<RegistrationStep[]>([]);
  currentIndex = input<number>(0);
  status = input<RegistrationStatus>(0);
  transformedSteps = signal<TransformedStep[]>([]);
  numberMapper = signal<any>(numberMapper);

  submit = output<boolean>();
  back = output<boolean>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.steps || changes.currentIndex) {
      this.transformSteps();
    }
  }

  private transformSteps() {
    this.transformedSteps.set(this.steps().map((step, index) => {
      let status: StepStatus = 'disabled';
      if (index < this.currentIndex()) {
        status = 'success';
      }
      if (index === this.currentIndex() && this.status() === RegistrationStatus.PENDING) {
        status = 'active';
      }
      if (index === this.currentIndex() && this.status() === RegistrationStatus.REJECTED) {
        status = 'rejected';
      }
      if (index === this.currentIndex() && this.status() === RegistrationStatus.CANCELED) {
        status = 'rejected';
      }
      return Object.assign({}, step, {
        status,
        tag: (StepTagData[step.uid] && StepTagData[step.uid][status]) ? StepTagData[step.uid][status] : step.tag,
      });
    }));
  }
}
