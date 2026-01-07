import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'ui-cs-smart-report-skeleton',
  templateUrl: './credit-smart-scoring-step-report-skeleton.component.html',
  standalone: true,
  styleUrls: ['./credit-smart-scoring-step-report-skeleton.component.scss'],
  imports: [NgxSkeletonLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoringStepReportSkeletonComponent {}
