import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-credit-stepper',
  templateUrl: './credit-stepper.component.html',
  styleUrl: './credit-stepper.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditStepperComponent {
  title = input.required<string>();
  steps = input<number>(1);
  currentStep = input<number>(1);
}
