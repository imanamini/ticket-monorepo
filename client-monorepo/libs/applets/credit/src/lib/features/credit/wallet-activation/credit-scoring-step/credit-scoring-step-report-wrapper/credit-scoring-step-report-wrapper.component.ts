import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CreditScoringStepReportComponent } from '../credit-scoring-step-report/credit-scoring-step-report.component';

@Component({
  selector: 'app-credit-scoring-step-report-wrapper',
  templateUrl: './credit-scoring-step-report-wrapper.component.html',
  styleUrls: ['./credit-scoring-step-report-wrapper.component.scss'],
  standalone: true,
  imports: [CreditScoringStepReportComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringStepReportWrapperComponent {
  trackingCode = input<string | null>(null);
  type = input<'without-pay' | 'with-pay'>('with-pay');
  back = output<void>();

  onBack() {
    this.back.emit();
  }
}
