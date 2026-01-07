import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'third-party-stepper',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './third-party-stepper.component.html',
  styleUrl: './third-party-stepper.component.scss'
})
export class ThirdPartyStepperComponent {

  title = input.required<string>();
  stepName = input.required<string>();
  totalSteps = input.required<number>();
  currentStep = input.required<number>();
  backgroundGray = input<boolean>(false);
}
