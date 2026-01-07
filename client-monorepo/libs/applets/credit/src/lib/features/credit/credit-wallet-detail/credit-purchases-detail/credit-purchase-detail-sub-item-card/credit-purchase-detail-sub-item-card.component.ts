import { Component, inject, input } from '@angular/core';
import { ContractPurchaseSubItem } from '../../../data-access/models/credit/installment/contract-purchase-sub-item';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditDigipayImageComponent } from '../../../components/credit-digipay-image/credit-digipay-image.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-credit-purchase-detail-sub-item-card',
  templateUrl: './credit-purchase-detail-sub-item-card.component.html',
  styleUrls: ['./credit-purchase-detail-sub-item-card.component.scss'],
  animations: [
    trigger('subItems', [
      transition('void => in', [style({ height: '0px' }), animate(200, style({ height: '*' }))]),
      transition('in => void', [style({ height: '*' }), animate(200, style({ height: '0px' }))]),
    ]),
  ],
  standalone: true,
  imports: [CreditDigipayImageComponent, NgxIcon, NgxButtonComponent],
})
export class CreditPurchaseDetailSubItemCardComponent {
  data = input.required<ContractPurchaseSubItem>();
  pageUrl = input<string>();
  expanded!: boolean;

  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);

  showTransactionDetail(): void {
    this.router.navigate([this.creditUrlService.getInnerServicePath('/transaction-detail/' + this.data()!.trackingCode)]);
  }
}
