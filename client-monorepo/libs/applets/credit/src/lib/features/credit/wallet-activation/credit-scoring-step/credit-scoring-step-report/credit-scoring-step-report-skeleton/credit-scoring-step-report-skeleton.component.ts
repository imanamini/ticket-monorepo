import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'ui-cs-report-skeleton',
  templateUrl: './credit-scoring-step-report-skeleton.component.html',
  standalone: true,
  styleUrls: ['./credit-scoring-step-report-skeleton.component.scss'],
  imports: [NgxSkeletonLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringStepReportSkeletonComponent {}
