import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { PipesModule } from '@digipay/ng-lib-pipes';
import {
  CreditScoringStepResultData,
  CreditScoringStepResultDataInterface,
  ScoringStatusType,
} from '../credit-scoring-result-page/credit-scoring-step-result-data';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-credit-scoring-step-result-status',
  standalone: true,
  imports: [PipesModule, NgxCalloutComponent, NgxStatusResultModule, NgxWaitingStepperComponent],
  templateUrl: './credit-scoring-step-result-status.component.html',
  styleUrl: './credit-scoring-step-result-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringStepResultStatusComponent {
  status = input<ScoringStatusType>();
  showSuggestedPlanButton = input<boolean>();
  trackingCode = input<string>();
  loading = input<boolean>(false);
  data = computed<CreditScoringStepResultDataInterface>(() => CreditScoringStepResultData[this.status()!]);
  buttons = computed(() => {
    const buttons: Buttons[] = [];
    if (this.status() === 'SUCCESS') {
      buttons.push({
        id: 'scoringSuccessContinueButton',
        label: 'ادامه ثبت‌نام',
        fullWidth: true,
        style: 'fill',
        mode: 'form',
      });
    }
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
        label: 'متوجه شدم',
        fullWidth: true,
        style: 'fill',
        mode: 'form',
      });
    }
    if (this.showSuggestedPlanButton()) {
      buttons.push({
        id: 'scoringSuggestedPlansButton',
        label: 'مشاهده طرح جایگزین',
        fullWidth: true,
        style: 'fill',
        mode: 'form',
      });
    }
    if (this.status() !== 'SHAHKAR_FAILED' && this.trackingCode()) {
      buttons.push({
        id: 'scoringReportButton',
        label: 'دریافت نتیجه گزارش',
        fullWidth: true,
        style: buttons.length ? 'tinted-on-elevated' : 'fill',
        mode: 'form',
      });
    }
    return buttons;
  });
  report = output<void>();
  goToActivation = output<void>();
  showSuggestedPlans = output<void>();
  cancelActivation = output<void>();
  close = output<void>();
  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;
  onActionClick(id: string) {
    if (id === 'scoringSuccessContinueButton') {
      this.goToActivation.emit();
      return;
    }
    if (id === 'scoringShahkarFailedConfirmButton' || id === 'scoringFailedConfirmButton') {
      this.close.emit();
      return;
    }
    if (id === 'scoringSuggestedPlansButton') {
      this.showSuggestedPlans.emit();
      return;
    }
    if (id === 'scoringReportButton') {
      this.report.emit();
      return;
    }
  }
}
