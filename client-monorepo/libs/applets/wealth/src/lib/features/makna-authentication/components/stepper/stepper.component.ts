import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActiveStepPipe } from '../../pipes/active-step.pipe';
import { StepperModel } from '../../models/stepper.model';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, ActiveStepPipe],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent {
  @Input() activeStep = 1;

  steps: StepperModel[] = [
    {
      id: 1,
      title: 'ورود شماره موبایل',
      icon: 'wealth-assets/icons/register-step-1.svg',
      disabledIcon: 'wealth-assets/icons/register-step-1.svg',
    },
    {
      id: 2,
      title: 'ورود کدملی',
      icon: 'wealth-assets/icons/register-step-2-active.svg',
      disabledIcon: 'wealth-assets/icons/register-step-2-disable.svg',
    },
    {
      id: 3,
      title: 'انتخاب رمز عبور',
      icon: 'wealth-assets/icons/register-step-3-active.svg',
      disabledIcon: 'wealth-assets/icons/register-step-3-disable.svg',
    },
  ];
}
