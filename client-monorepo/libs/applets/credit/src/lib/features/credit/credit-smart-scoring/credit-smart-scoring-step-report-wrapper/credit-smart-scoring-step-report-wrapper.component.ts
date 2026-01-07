import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CreditSmartScoringStepReportComponent } from '../credit-scoring-step-report/credit-smart-scoring-step-report.component';

@Component({
  selector: 'app-credit-scoring-step-report-wrapper',
  templateUrl: './credit-smart-scoring-step-report-wrapper.component.html',
  styleUrls: ['./credit-smart-scoring-step-report-wrapper.component.scss'],
  standalone: true,
  imports: [CreditSmartScoringStepReportComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoringStepReportWrapperComponent {
  trackingCode = input<string | null>(null);
  type = input<'without-pay' | 'with-pay'>('with-pay');
  back = output<void>();

  onBack() {
    this.back.emit();
  }
}
