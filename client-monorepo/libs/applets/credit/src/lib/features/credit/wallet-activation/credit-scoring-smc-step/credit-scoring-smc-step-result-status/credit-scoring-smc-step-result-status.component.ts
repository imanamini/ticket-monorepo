import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { PipesModule } from '@digipay/ng-lib-pipes';
import {
  CreditScoringSmcStepResultData,
  CreditScoringStepResultDataInterface,
  ScoringStatusType,
} from '../credit-scoring-smc-result-page/credit-scoring-smc-step-result-data';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-credit-scoring-smc-step-result-status',
  standalone: true,
  imports: [PipesModule, NgxCalloutComponent, NgxStatusResultModule, NgxWaitingStepperComponent],
  templateUrl: './credit-scoring-smc-step-result-status.component.html',
  styleUrl: './credit-scoring-smc-step-result-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringSmcStepResultStatusComponent {
  status = input<ScoringStatusType>();
  showSuggestedPlanButton = input<boolean>();
  trackingCode = input<string>();
  loading = input<boolean>(false);
  buttons = computed(() => {
    const buttons: Buttons[] = [];
    if (this.status() === 'SHAHKAR_FAILED') {
      buttons.push({
        id: 'scoringShahkarFailedConfirmButton',
        label: 'متوجه شدم',
        fullWidth: true,
        style: 'fill',
        mode: 'form',
      });
    }
    if (this.status() === 'FAILED') {
      buttons.push({
        id: 'scoringFailedConfirmButton',
        label: 'بازگشت',
        fullWidth: true,
        style: 'fill',
        mode: 'form',
      });
    }
    return buttons;
  });
  data = computed<CreditScoringStepResultDataInterface>(() => CreditScoringSmcStepResultData[this.status()!]);
  report = output<void>();
  goToActivation = output<void>();
  cancelActivation = output<void>();
  close = output<void>();
  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;

  onActionClick(id: string) {
    if (id === 'scoringShahkarFailedConfirmButton') {
      this.close.emit();
      return;
    }
    if (id === 'scoringFailedConfirmButton') {
      this.goToActivation.emit();
      return;
    }
  }
}
