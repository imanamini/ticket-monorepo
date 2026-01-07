import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { numberMapper } from '../../../../../../../../api/clients/registration/basic-models/numberMapper';

export interface Step {
  title: string;
  description?: string;
}

@Component({
  selector: 'es-loan-registration-ics-reporting-stepper',
  standalone: true,
  imports: [],
  templateUrl: './es-loan-registration-ics-reporting-stepper.component.html',
  styleUrl: './es-loan-registration-ics-reporting-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRegistrationIcsReportingStepperComponent {
  steps = input<Step[]>([]);
  activeStepIndex = input<number>(0);
}
