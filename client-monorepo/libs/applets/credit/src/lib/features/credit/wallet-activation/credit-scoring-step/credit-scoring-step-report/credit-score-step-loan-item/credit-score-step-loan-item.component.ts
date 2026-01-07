import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CreditReportContract } from '../../../../data-access/models/credit-scoring/credit-report-response';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CreditDigipayImageComponent } from '../../../../components/credit-digipay-image/credit-digipay-image.component';

@Component({
  selector: 'app-credit-score-step-loan-item',
  templateUrl: './credit-score-step-loan-item.component.html',
  standalone: true,
  styleUrls: ['./credit-score-step-loan-item.component.scss'],
  imports: [NgxBadgeModule, CreditDigipayImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoreStepLoanItemComponent {
  contract = input<CreditReportContract>();

  showMore = input(false);
}
