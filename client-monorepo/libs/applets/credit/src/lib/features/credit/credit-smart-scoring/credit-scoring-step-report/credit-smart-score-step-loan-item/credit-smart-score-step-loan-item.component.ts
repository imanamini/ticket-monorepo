import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CreditDigipayImageComponent } from '../../../components/credit-digipay-image/credit-digipay-image.component';
import { CreditReportContract } from '../../../data-access/models/credit-scoring/credit-report-response';

@Component({
  selector: 'app-credit-smart-score-step-loan-item',
  templateUrl: './credit-smart-score-step-loan-item.component.html',
  standalone: true,
  styleUrls: ['./credit-smart-score-step-loan-item.component.scss'],
  imports: [NgxBadgeModule, CreditDigipayImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoreStepLoanItemComponent {
  contract = input<CreditReportContract>();

  showMore = input(false);
}
