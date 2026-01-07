import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContractPurchaseGroup } from '../../../data-access/models/credit/installment/contract-purchase-group';
import { CreditPurchaseDetailSubItemCardComponent } from '../credit-purchase-detail-sub-item-card/credit-purchase-detail-sub-item-card.component';
import { CreditDigipayImageComponent } from '../../../components/credit-digipay-image/credit-digipay-image.component';

@Component({
  selector: 'app-credit-purchase-group-detail',
  templateUrl: './credit-purchase-group-detail.component.html',
  styleUrls: ['./credit-purchase-group-detail.component.scss'],
  standalone: true,
  imports: [CreditDigipayImageComponent, CreditPurchaseDetailSubItemCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPurchaseGroupDetailComponent {
  purchaseGroup = input<ContractPurchaseGroup>();
  pageUrl = input<string>();
}
