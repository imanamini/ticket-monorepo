import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViolationStepConfigMapper } from '../../data-access/constants/violation.const';
import { NgxStepperComponent } from '@digipay/ngx-stepper';
import { StepModel } from '@digipay/ngx-stepper/lib/model/step.model';
import { ViolationService } from '../../data-access/services/violation.service';

@Component({
  selector: 'stores-applet-violation-stepper',
  standalone: true,
  imports: [CommonModule, NgxStepperComponent],
  templateUrl: './violation-stepper.component.html',
  styleUrl: './violation-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationStepperComponent {
  // Injections
  violationService = inject(ViolationService);

  // Variables
  steps = this.violationService.steps;
  currentStep = this.violationService.currentStep;
  stepperSteps = computed<StepModel[]>(() => {
    return this.steps().map((item, index) => {
      const config = ViolationStepConfigMapper[item];
      return {
        id: index,
        circleNode: {
          type: 'icon',
          state: 'current',
          icon: 'bnpl',
        },
        info: { type: 'vertical', title: `مرحله ${index + 1}:`, description: config.description, state: 'current', showDescription: true },
        connector: {
          type: 'dot',
          state: 'current',
        },
      };
    });
  });
  currentConfig = computed(() => ViolationStepConfigMapper[this.steps()[this.currentStep()]]);
}
